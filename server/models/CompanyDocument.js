const mongoose = require('mongoose');
const mockDb = require('../utils/mockDb');

const companyDocSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Engineering' },
  content: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

let CompanyDocModel;
try {
  CompanyDocModel = mongoose.model('CompanyDocument', companyDocSchema);
} catch (e) {
  CompanyDocModel = mongoose.model('CompanyDocument');
}

class CompanyDocument {
  static get isMock() {
    return mongoose.connection.readyState !== 1;
  }

  static async find(query = {}) {
    if (!CompanyDocument.isMock) return CompanyDocModel.find(query);
    return mockDb.find('company_documents', query);
  }

  static async findOne(query = {}) {
    if (!CompanyDocument.isMock) return CompanyDocModel.findOne(query);
    return mockDb.findOne('company_documents', query);
  }

  static async findById(id) {
    if (!CompanyDocument.isMock) return CompanyDocModel.findById(id);
    return mockDb.findById('company_documents', id);
  }

  static async create(data) {
    if (!CompanyDocument.isMock) return CompanyDocModel.create(data);
    return mockDb.create('company_documents', data);
  }

  static async deleteOne(query = {}) {
    if (!CompanyDocument.isMock) return CompanyDocModel.deleteOne(query);
    return mockDb.deleteOne('company_documents', query);
  }
}

module.exports = CompanyDocument;
