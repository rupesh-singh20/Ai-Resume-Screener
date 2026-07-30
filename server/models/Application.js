const mongoose = require('mongoose');
const mockDb = require('../utils/mockDb');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  score: { type: Number, default: 0 },
  summary: { type: String },
  matchReport: { type: Object },
  readinessScore: { type: Number, default: 50 },
  weakAreas: [{ type: String }],
  prepHubData: { type: Object },
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Rejected'], default: 'Applied' },
  appliedAt: { type: Date, default: Date.now }
});

let ApplicationModel;
try {
  ApplicationModel = mongoose.model('Application', applicationSchema);
} catch (e) {
  ApplicationModel = mongoose.model('Application');
}

class Application {
  static get isMock() {
    return mongoose.connection.readyState !== 1;
  }

  static async find(query = {}) {
    if (!Application.isMock) {
      return ApplicationModel.find(query)
        .populate('jobId')
        .populate('candidateId')
        .populate('resumeId')
        .sort({ appliedAt: -1 });
    }
    // Mock populate helper
    const apps = await mockDb.find('applications', query);
    const populated = [];
    for (const app of apps) {
      const job = await mockDb.findById('jobs', app.jobId);
      const candidate = await mockDb.findById('users', app.candidateId);
      const resume = await mockDb.findById('resumes', app.resumeId);
      populated.push({
        ...app,
        jobId: job,
        candidateId: candidate,
        resumeId: resume
      });
    }
    return populated.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }

  static async findOne(query = {}) {
    if (!Application.isMock) {
      return ApplicationModel.findOne(query)
        .populate('jobId')
        .populate('candidateId')
        .populate('resumeId');
    }
    const app = await mockDb.findOne('applications', query);
    if (!app) return null;
    const job = await mockDb.findById('jobs', app.jobId);
    const candidate = await mockDb.findById('users', app.candidateId);
    const resume = await mockDb.findById('resumes', app.resumeId);
    return {
      ...app,
      jobId: job,
      candidateId: candidate,
      resumeId: resume
    };
  }

  static async findById(id) {
    if (!Application.isMock) {
      return ApplicationModel.findById(id)
        .populate('jobId')
        .populate('candidateId')
        .populate('resumeId');
    }
    const app = await mockDb.findById('applications', id);
    if (!app) return null;
    const job = await mockDb.findById('jobs', app.jobId);
    const candidate = await mockDb.findById('users', app.candidateId);
    const resume = await mockDb.findById('resumes', app.resumeId);
    return {
      ...app,
      jobId: job,
      candidateId: candidate,
      resumeId: resume
    };
  }

  static async create(data) {
    if (!Application.isMock) return ApplicationModel.create(data);
    return mockDb.create('applications', data);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (!Application.isMock) return ApplicationModel.findByIdAndUpdate(id, data, { new: true, ...options });
    return mockDb.findByIdAndUpdate('applications', id, data);
  }

  static async deleteOne(query = {}) {
    if (!Application.isMock) return ApplicationModel.deleteOne(query);
    return mockDb.deleteOne('applications', query);
  }

  static async countDocuments(query = {}) {
    if (!Application.isMock) return ApplicationModel.countDocuments(query);
    const results = await mockDb.find('applications', query);
    return results.length;
  }
}

module.exports = Application;
