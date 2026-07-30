const express = require('express');
const router = express.Router();
const {
  getCareerDNA,
  chatCoach,
  simulateCareerGoal,
  predictSalary,
  getWeeklyReport,
  runHiringAgentCommand,
  queryCandidates,
  uploadCompanyDoc,
  queryCompanyDoc,
  getCompanyDocs
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Candidate routes
router.get('/dna', protect, authorize('Candidate'), getCareerDNA);
router.post('/coach', protect, authorize('Candidate'), chatCoach);
router.post('/simulate', protect, authorize('Candidate'), simulateCareerGoal);
router.post('/salary-predict', protect, predictSalary); // Public calculator or shared
router.get('/weekly-report', protect, authorize('Candidate'), getWeeklyReport);

// Recruiter routes
router.post('/hiring-agent', protect, authorize('Recruiter'), runHiringAgentCommand);
router.get('/search-candidates', protect, authorize('Recruiter'), queryCandidates);

// Company Knowledge Base routes
router.post('/company-doc', protect, uploadCompanyDoc);
router.post('/company-query', protect, queryCompanyDoc);
router.get('/company-docs', protect, getCompanyDocs);

module.exports = router;
