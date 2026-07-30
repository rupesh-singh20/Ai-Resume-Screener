const mongoose = require('mongoose');
const mockDb = require('../utils/mockDb');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String },
  text: { type: String, required: true },
  analysis: {
    score: { type: Number, default: 0 },
    structure: { type: Number, default: 0 },
    contactInfo: { type: Number, default: 0 },
    technicalSkills: [String],
    softSkills: [String],
    experience: { type: Number, default: 0 }, // Score
    projects: { type: Number, default: 0 }, // Score
    education: { type: Number, default: 0 }, // Score
    certifications: [String],
    keywords: [String],
    grammar: { type: Number, default: 0 }, // Score
    formatting: { type: Number, default: 0 }, // Score
    compatibility: { type: Number, default: 0 }, // Score
    summary: { type: String },
    suggestions: [String],
    missingSkills: [String],
    learningRoadmap: [{
      step: String,
      description: String,
      resource: String
    }],
    careerRecommendation: { type: String }
  },
  versions: [{
    filename: String,
    fileUrl: String,
    text: String,
    score: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

let ResumeModel;
try {
  ResumeModel = mongoose.model('Resume', resumeSchema);
} catch (e) {
  ResumeModel = mongoose.model('Resume');
}

class Resume {
  static get isMock() {
    return mongoose.connection.readyState !== 1;
  }

  static async find(query = {}) {
    if (!Resume.isMock) return ResumeModel.find(query).sort({ createdAt: -1 });
    return (await mockDb.find('resumes', query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findOne(query = {}) {
    if (!Resume.isMock) return ResumeModel.findOne(query);
    return mockDb.findOne('resumes', query);
  }

  static async findById(id) {
    if (!Resume.isMock) return ResumeModel.findById(id);
    return mockDb.findById('resumes', id);
  }

  static async create(data) {
    if (!Resume.isMock) return ResumeModel.create(data);
    return mockDb.create('resumes', data);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (!Resume.isMock) return ResumeModel.findByIdAndUpdate(id, data, { new: true, ...options });
    return mockDb.findByIdAndUpdate('resumes', id, data);
  }

  static async deleteOne(query = {}) {
    if (!Resume.isMock) return ResumeModel.deleteOne(query);
    return mockDb.deleteOne('resumes', query);
  }

  static async countDocuments(query = {}) {
    if (!Resume.isMock) return ResumeModel.countDocuments(query);
    const results = await mockDb.find('resumes', query);
    return results.length;
  }
}

module.exports = Resume;
