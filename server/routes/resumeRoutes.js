const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadResume,
  getLatestResume,
  getVersionsHistory,
  generateCoverLetter,
  getInterviewQuestions,
  evaluateInterviewAnswer,
  matchJob
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Set up memory storage for files to directly parse them without cluttering local folders
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|docx|msword|png|jpg|jpeg/;
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOCX, Word, or Image files are allowed.'));
  }
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/latest', protect, getLatestResume);
router.get('/history', protect, getVersionsHistory);
router.post('/cover-letter', protect, generateCoverLetter);
router.get('/mock-questions', protect, getInterviewQuestions);
router.post('/mock-evaluate', protect, evaluateInterviewAnswer);
router.post('/match-job', protect, matchJob);

module.exports = router;
