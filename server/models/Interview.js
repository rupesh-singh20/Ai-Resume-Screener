const mongoose = require('mongoose');
const mockDb = require('../utils/mockDb');

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  link: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  feedback: { type: String },
  questions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

let InterviewModel;
try {
  InterviewModel = mongoose.model('Interview', interviewSchema);
} catch (e) {
  InterviewModel = mongoose.model('Interview');
}

class Interview {
  static get isMock() {
    return mongoose.connection.readyState !== 1;
  }

  static async find(query = {}) {
    if (!Interview.isMock) {
      return InterviewModel.find(query)
        .populate('applicationId')
        .populate('candidateId')
        .populate('jobId')
        .sort({ createdAt: -1 });
    }
    const interviews = await mockDb.find('interviews', query);
    const populated = [];
    for (const interview of interviews) {
      const app = await mockDb.findById('applications', interview.applicationId);
      const candidate = await mockDb.findById('users', interview.candidateId);
      const job = await mockDb.findById('jobs', interview.jobId);
      populated.push({
        ...interview,
        applicationId: app,
        candidateId: candidate,
        jobId: job
      });
    }
    return populated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findById(id) {
    if (!Interview.isMock) {
      return InterviewModel.findById(id)
        .populate('applicationId')
        .populate('candidateId')
        .populate('jobId');
    }
    const interview = await mockDb.findById('interviews', id);
    if (!interview) return null;
    const app = await mockDb.findById('applications', interview.applicationId);
    const candidate = await mockDb.findById('users', interview.candidateId);
    const job = await mockDb.findById('jobs', interview.jobId);
    return {
      ...interview,
      applicationId: app,
      candidateId: candidate,
      jobId: job
    };
  }

  static async create(data) {
    if (!Interview.isMock) return InterviewModel.create(data);
    return mockDb.create('interviews', data);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (!Interview.isMock) return InterviewModel.findByIdAndUpdate(id, data, { new: true, ...options });
    return mockDb.findByIdAndUpdate('interviews', id, data);
  }

  static async deleteOne(query = {}) {
    if (!Interview.isMock) return InterviewModel.deleteOne(query);
    return mockDb.deleteOne('interviews', query);
  }
}

module.exports = Interview;
