const User = require('../models/User');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Application = require('../models/Application');

const getAnalytics = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({ role: 'Candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'Recruiter' });
    const totalJobs = await Job.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Mock platform/AI request metrics by day for visual dashboards
    const dailyAiRequests = [
      { day: 'Mon', count: 12 },
      { day: 'Tue', count: 19 },
      { day: 'Wed', count: 32 },
      { day: 'Thu', count: 28 },
      { day: 'Fri', count: 45 },
      { day: 'Sat', count: 18 },
      { day: 'Sun', count: 24 }
    ];

    res.json({
      summary: {
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalResumes,
        totalApplications
      },
      dailyAiRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Exclude password hashes
    const sanitized = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      companyDetails: u.companyDetails,
      createdAt: u.createdAt
    }));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'Admin') {
      return res.status(400).json({ message: 'Admins cannot delete other administrative accounts.' });
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  deleteUser
};
