const mongoose = require('mongoose');
const mockDb = require('../utils/mockDb');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: { type: String, required: true },
  salary: { type: String },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

let JobModel;
try {
  JobModel = mongoose.model('Job', jobSchema);
} catch (e) {
  JobModel = mongoose.model('Job');
}

class Job {
  static get isMock() {
    return mongoose.connection.readyState !== 1;
  }

  static async find(query = {}) {
    if (!Job.isMock) return JobModel.find(query).sort({ createdAt: -1 });
    return (await mockDb.find('jobs', query)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findOne(query = {}) {
    if (!Job.isMock) return JobModel.findOne(query);
    return mockDb.findOne('jobs', query);
  }

  static async findById(id) {
    if (!Job.isMock) return JobModel.findById(id);
    return mockDb.findById('jobs', id);
  }

  static async create(data) {
    if (!Job.isMock) return JobModel.create(data);
    return mockDb.create('jobs', data);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (!Job.isMock) return JobModel.findByIdAndUpdate(id, data, { new: true, ...options });
    return mockDb.findByIdAndUpdate('jobs', id, data);
  }

  static async deleteOne(query = {}) {
    if (!Job.isMock) return JobModel.deleteOne(query);
    return mockDb.deleteOne('jobs', query);
  }

  static async countDocuments(query = {}) {
    if (!Job.isMock) return JobModel.countDocuments(query);
    const results = await mockDb.find('jobs', query);
    return results.length;
  }
}

module.exports = Job;
