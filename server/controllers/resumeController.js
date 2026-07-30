const Resume = require('../models/Resume');
const parserService = require('../services/parserService');
const aiService = require('../services/aiService');

const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Please upload a PDF, DOCX, or Image file.' });
  }

  try {
    // 1. Parse the uploaded document
    const extractedText = await parserService.parseResume(req.file);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text content from the uploaded file. Ensure it is not empty or corrupted.' });
    }

    // 2. Perform AI Analysis on the text
    console.log('Sending extracted text to Gemini AI for analysis...');
    const analysis = await aiService.analyzeResume(extractedText);

    // 3. Save to database or update existing
    // Check if the candidate already has a resume record
    let resume = await Resume.findOne({ userId: req.user._id });

    if (resume) {
      // Add current resume to version history
      resume.versions.push({
        filename: resume.filename,
        fileUrl: resume.fileUrl,
        text: resume.text,
        score: resume.analysis.score,
        createdAt: resume.createdAt
      });

      // Update active resume
      resume.filename = req.file.originalname;
      resume.text = extractedText;
      resume.analysis = analysis;
      resume.createdAt = new Date();

      await Resume.findByIdAndUpdate(resume._id, resume);
    } else {
      // Create new resume record
      resume = await Resume.create({
        userId: req.user._id,
        filename: req.file.originalname,
        text: extractedText,
        analysis,
        versions: []
      });
    }

    res.status(201).json({
      message: 'Resume uploaded and analyzed successfully!',
      resume
    });
  } catch (error) {
    console.error('Resume upload/analysis error:', error);
    res.status(500).json({ message: error.message || 'Error occurred while processing resume.' });
  }
};

const getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found for this candidate. Please upload one first.' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVersionsHistory = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found.' });
    }
    res.json(resume.versions || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateCoverLetter = async (req, res) => {
  const { jobTitle, companyName } = req.body;

  if (!jobTitle || !companyName) {
    return res.status(400).json({ message: 'Please provide jobTitle and companyName.' });
  }

  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Please upload a resume first to extract details.' });
    }

    const coverLetter = await aiService.generateCoverLetter(resume.text, jobTitle, companyName);
    res.json({ coverLetter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInterviewQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Please upload a resume first.' });
    }

    const questions = await aiService.generateInterviewQuestions(resume.text);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const evaluateInterviewAnswer = async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Please provide question and answer.' });
  }

  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    const resumeContext = resume ? resume.text : '';

    const evaluation = await aiService.gradeInterviewAnswer(question, answer, resumeContext);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const matchJob = async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription) {
    return res.status(400).json({ message: 'Please provide a jobDescription.' });
  }

  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Please upload your resume first.' });
    }

    const matchResults = await aiService.matchJobDescription(resume.text, jobDescription);
    res.json(matchResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResume,
  getLatestResume,
  getVersionsHistory,
  generateCoverLetter,
  getInterviewQuestions,
  evaluateInterviewAnswer,
  matchJob
};
