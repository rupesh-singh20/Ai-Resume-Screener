const Job = require('../models/Job');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const User = require('../models/User');
const Interview = require('../models/Interview');
const aiService = require('../services/aiService');
const parserService = require('../services/parserService');
const { sendInterviewScheduleEmail, sendShortlistEmail } = require('../services/emailService');

// 1. Create a job (Recruiter)
const createJob = async (req, res) => {
  const { title, company, description, requirements, location, salary } = req.body;

  if (!title || !company || !description || !location) {
    return res.status(400).json({ message: 'Title, company, description, and location are required.' });
  }

  try {
    const job = await Job.create({
      title,
      company,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(s => s.trim()) : []),
      location,
      salary,
      recruiterId: req.user._id
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get single job details
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Apply to a job (Candidate)
const applyToJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found.' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({ jobId, candidateId: req.user._id });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }

    // Check if candidate has a resume
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) {
      return res.status(400).json({ message: 'Please upload a resume in your profile before applying.' });
    }

    // Calculate match score
    console.log(`Calculating matching score for candidate application to job: ${job.title}...`);
    const matchAnalysis = await aiService.matchJobDescription(resume.text, job.description);

    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      resumeId: resume._id,
      score: matchAnalysis.score || 0,
      summary: matchAnalysis.fitExplanation || 'Fit analysis generated.',
      matchReport: matchAnalysis,
      status: 'Applied'
    });

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: error.message });
  }
};

// 5. Get applications for a job (Recruiter)
const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. AI Rank candidate applications for a job (Recruiter)
const getRankedApplicants = async (req, res) => {
  const { jobId } = req.params;

  try {
    const applications = await Application.find({ jobId });
    if (!applications || applications.length === 0) {
      return res.json([]);
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Format candidates for ranking service
    const candidatesForRanking = applications.map(app => ({
      id: app._id,
      name: app.candidateId.name,
      text: app.resumeId.text
    }));

    console.log(`AI Ranking ${candidatesForRanking.length} applicants for job: ${job.title}...`);
    const rankedResults = await aiService.rankCandidates(candidatesForRanking, job.description);

    // Merge ranking details back into the application records
    const rankedApps = applications.map(app => {
      const rankInfo = rankedResults.find(r => r.id === app._id) || {};
      return {
        ...app,
        rank: rankInfo.rank || 99,
        aiScore: rankInfo.score || app.score,
        reason: rankInfo.reason || 'Candidate has suitable attributes matching requirements.'
      };
    }).sort((a, b) => a.rank - b.rank);

    res.json(rankedApps);
  } catch (error) {
    console.error('Candidate ranking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// 7. Shortlist candidate application (Recruiter)
const shortlistApplicant = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update status
    application.status = 'Shortlisted';
    const updatedApp = await Application.findByIdAndUpdate(application._id, { status: 'Shortlisted' });

    // Send shortlist email notification
    const candidate = await User.findById(application.candidateId._id);
    const job = await Job.findById(application.jobId._id);
    
    if (candidate && job) {
      await sendShortlistEmail(candidate.email, candidate.name, job.title, job.company);
    }

    res.json({ message: 'Applicant shortlisted and notified.', application: updatedApp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Schedule Interview (Recruiter)
const scheduleInterview = async (req, res) => {
  const { date, time, link } = req.body;
  const applicationId = req.params.id;

  if (!date || !time || !link) {
    return res.status(400).json({ message: 'Date, time, and meeting link are required.' });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Generate AI Interview Questions for the meeting context
    const resume = await Resume.findById(application.resumeId._id);
    let questions = [];
    if (resume) {
      questions = await aiService.generateInterviewQuestions(resume.text, 3);
    }

    const interview = await Interview.create({
      applicationId: application._id,
      candidateId: application.candidateId._id,
      jobId: application.jobId._id,
      date,
      time,
      link,
      questions,
      status: 'Scheduled'
    });

    // Notify candidate
    const candidate = await User.findById(application.candidateId._id);
    const job = await Job.findById(application.jobId._id);

    if (candidate && job) {
      await sendInterviewScheduleEmail(candidate.email, candidate.name, job.title, job.company, date, time, link);
    }

    res.status(201).json({ message: 'Interview scheduled and candidate notified via email.', interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. Get candidate's applied jobs
const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. Get recruiter's job list
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11. Get Application Detail
const getApplicationDetail = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    if (req.user.role === 'Candidate' && application.candidateId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this application.' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12. Re-Analyze Application
const reAnalyzeApplication = async (req, res) => {
  const applicationId = req.params.id;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Check authorization
    if (application.candidateId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this application.' });
    }

    const job = await Job.findById(application.jobId._id || application.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Associated job listing not found.' });
    }

    let resumeText = '';
    let resumeId = application.resumeId._id || application.resumeId;

    if (req.file) {
      // 1. If a new resume is uploaded, parse it
      console.log('Parsing new resume for re-analysis...');
      resumeText = await parserService.parseResume(req.file);
      if (!resumeText || resumeText.trim().length === 0) {
        return res.status(400).json({ message: 'Could not parse the uploaded resume.' });
      }

      // 2. Perform AI Analysis on the new text
      console.log('Analyzing resume with Gemini...');
      const analysis = await aiService.analyzeResume(resumeText);

      // 3. Update the Candidate's Resume record (or create one)
      let resume = await Resume.findOne({ userId: req.user._id });
      if (resume) {
        // Add current resume to versions history
        resume.versions.push({
          filename: resume.filename,
          fileUrl: resume.fileUrl,
          text: resume.text,
          score: resume.analysis.score,
          createdAt: resume.createdAt
        });
        resume.filename = req.file.originalname;
        resume.text = resumeText;
        resume.analysis = analysis;
        resume.createdAt = new Date();
        await Resume.findByIdAndUpdate(resume._id, resume);
      } else {
        resume = await Resume.create({
          userId: req.user._id,
          filename: req.file.originalname,
          text: resumeText,
          analysis,
          versions: []
        });
      }
      resumeId = resume._id;
    } else {
      // Use existing resume text
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(400).json({ message: 'Active resume not found. Please upload a resume first.' });
      }
      resumeText = resume.text;
    }

    // Re-calculate the match analysis
    console.log(`Re-matching resume with job: ${job.title}...`);
    const matchAnalysis = await aiService.matchJobDescription(resumeText, job.description);

    // Update application fields
    const updatedFields = {
      resumeId,
      score: matchAnalysis.score || 0,
      summary: matchAnalysis.fitExplanation || 'Fit analysis updated.',
      matchReport: matchAnalysis
    };

    await Application.findByIdAndUpdate(applicationId, updatedFields);
    // Retrieve populated updated application
    const finalApp = await Application.findById(applicationId);

    res.json({
      message: 'Application re-analyzed successfully!',
      application: finalApp
    });
  } catch (error) {
    console.error('Re-analysis error:', error);
    res.status(500).json({ message: error.message });
  }
};

// 13. Get Interview Prep Hub Data
const getPrepHubData = async (req, res) => {
  const applicationId = req.params.id;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    if (application.candidateId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this Prep Hub.' });
    }

    const job = await Job.findById(application.jobId._id || application.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Associated job listing not found' });
    }

    // Generate prepHubData if not present
    if (!application.prepHubData || Object.keys(application.prepHubData).length === 0) {
      console.log('Generating new Prep Hub data using Gemini...');
      const resume = await Resume.findById(application.resumeId._id || application.resumeId);
      const resumeText = resume ? resume.text : 'Candidate profile details';
      
      const generatedData = await aiService.generatePrepHubData(resumeText, job.description, job.company);
      
      // Update application
      application.prepHubData = generatedData;
      await Application.findByIdAndUpdate(applicationId, { prepHubData: generatedData });
    }

    res.json({
      readinessScore: application.readinessScore || 50,
      weakAreas: application.weakAreas || [],
      prepHubData: application.prepHubData,
      jobTitle: job.title,
      company: job.company
    });
  } catch (error) {
    console.error('Error fetching Prep Hub data:', error);
    res.status(500).json({ message: error.message });
  }
};

// 14. Submit Practice Question Answer
const submitPrepAnswer = async (req, res) => {
  const applicationId = req.params.id;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required.' });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Check authorization
    if (application.candidateId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access.' });
    }

    const resume = await Resume.findById(application.resumeId._id || application.resumeId);
    const resumeContext = resume ? resume.text : '';

    console.log('Evaluating prep answer...');
    const evaluation = await aiService.gradeInterviewAnswer(question, answer, resumeContext);

    // Calculate rating and update readinessScore & weakAreas
    const rating = Number(evaluation.rating) || 3;
    let newReadiness = application.readinessScore || 50;

    if (rating >= 4) {
      newReadiness = Math.min(newReadiness + 8, 100);
    } else {
      newReadiness = Math.max(newReadiness - 5, 20);
      // Add missing topics to weakAreas (e.g. up to 5 unique weak areas)
      const currentWeak = new Set(application.weakAreas || []);
      if (evaluation.keyMissingPoints && evaluation.keyMissingPoints.length > 0) {
        evaluation.keyMissingPoints.slice(0, 2).forEach(pt => {
          if (pt.length < 40) { // Keep it concise
            currentWeak.add(pt);
          } else {
            currentWeak.add(pt.substring(0, 37) + '...');
          }
        });
      }
      application.weakAreas = Array.from(currentWeak).slice(0, 6);
    }

    await Application.findByIdAndUpdate(applicationId, {
      readinessScore: newReadiness,
      weakAreas: application.weakAreas
    });

    res.json({
      evaluation,
      readinessScore: newReadiness,
      weakAreas: application.weakAreas
    });
  } catch (error) {
    console.error('Error grading prep answer:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  applyToJob,
  getJobApplications,
  getRankedApplicants,
  shortlistApplicant,
  scheduleInterview,
  getCandidateApplications,
  getRecruiterJobs,
  getApplicationDetail,
  reAnalyzeApplication,
  getPrepHubData,
  submitPrepAnswer
};
