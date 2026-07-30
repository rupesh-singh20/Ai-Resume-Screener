const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
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
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

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

router.route('/')
  .get(getJobs)
  .post(protect, authorize('Recruiter'), createJob);

router.get('/recruiter', protect, authorize('Recruiter'), getRecruiterJobs);
router.get('/candidate', protect, authorize('Candidate'), getCandidateApplications);

router.get('/application/:id', protect, getApplicationDetail);
router.post('/application/:id/re-analyze', protect, upload.single('resume'), reAnalyzeApplication);
router.get('/application/:id/prep-hub', protect, getPrepHubData);
router.post('/application/:id/prep-hub/evaluate', protect, submitPrepAnswer);

router.route('/:id')
  .get(getJobById);

router.post('/:id/apply', protect, authorize('Candidate'), applyToJob);
router.get('/:jobId/applications', protect, authorize('Recruiter'), getJobApplications);
router.get('/:jobId/rank', protect, authorize('Recruiter'), getRankedApplicants);

router.put('/application/:id/shortlist', protect, authorize('Recruiter'), shortlistApplicant);
router.post('/application/:id/interview', protect, authorize('Recruiter'), scheduleInterview);

module.exports = router;
