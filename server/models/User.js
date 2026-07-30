const mongoose = require('mongoose');
const mockDb = require('../utils/mockDb');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Candidate', 'Recruiter', 'Admin'], default: 'Candidate' },
  companyDetails: {
    name: String,
    industry: String,
    website: String,
    description: String
  },
  createdAt: { type: Date, default: Date.now }
});

let UserModel;
try {
  UserModel = mongoose.model('User', userSchema);
} catch (e) {
  UserModel = mongoose.model('User');
}

class User {
  static get isMock() {
    return mongoose.connection.readyState !== 1;
  }

  static async find(query = {}) {
    if (!User.isMock) return UserModel.find(query);
    return mockDb.find('users', query);
  }

  static async findOne(query = {}) {
    if (!User.isMock) return UserModel.findOne(query);
    return mockDb.findOne('users', query);
  }

  static async findById(id) {
    if (!User.isMock) return UserModel.findById(id);
    return mockDb.findById('users', id);
  }

  static async create(data) {
    if (!User.isMock) return UserModel.create(data);
    return mockDb.create('users', data);
  }

  static async findByIdAndUpdate(id, data, options = {}) {
    if (!User.isMock) return UserModel.findByIdAndUpdate(id, data, { new: true, ...options });
    return mockDb.findByIdAndUpdate('users', id, data);
  }

  static async deleteOne(query = {}) {
    if (!User.isMock) return UserModel.deleteOne(query);
    return mockDb.deleteOne('users', query);
  }

  static async countDocuments(query = {}) {
    if (!User.isMock) return UserModel.countDocuments(query);
    const results = await mockDb.find('users', query);
    return results.length;
  }
}

module.exports = User;
