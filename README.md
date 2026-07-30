# AIHireX — AI-Powered Resume Screening & Recruitment Platform

[![AIHireX Platform](https://img.shields.io/badge/Platform-AIHireX-6366f1?style=for-the-badge&logo=react)](http://localhost:5173/)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Gemini%20AI-4f46e5?style=for-the-badge)](https://github.com/rupesh-singh20/Ai-Resume-Screener)

**AIHireX** is an end-to-end AI-powered Resume Screening & Recruitment Platform built using the MERN Stack (MongoDB, Express.js, React, Node.js) and Google Gemini 2.5 AI. The platform provides job seekers with ATS resume optimization, missing skills analysis, and interactive mock interviews, while enabling recruiters to screen, rank, and manage applicant pipelines seamlessly.

---

## ✨ Key Features

### 👤 Candidate Workspace
- **Secure Authentication**: JWT-based authentication & profile management.
- **ATS Resume Scoring**: Real-time 0-100 ATS compatibility evaluation, keyword gap detection, and formatting suggestions.
- **AI Mock Interviews**: Realistic role-specific interview simulation powered by Google Gemini AI with instant answer scoring and feedback.
- **Career Roadmap & Skill Analyzer**: Tailored skill gap recommendations, learning roadmaps, and custom cover letter generation.
- **Application Tracker**: Real-time status monitoring for active job applications.

### 💼 Recruiter Command HQ
- **Requisition Management**: Create, publish, and manage job openings and requirements.
- **Automated Candidate Ranking**: Rank applicants automatically based on ATS compatibility and skill alignment.
- **AI Recruiter Copilot**: Intelligent search and candidate recommendations with transparent AI scoring breakdowns.
- **Email & Pipeline Dispatcher**: Send interview invitations and update stage statuses directly from the dashboard.

### 🛡️ Admin & Analytics Module
- **Platform Monitoring**: Track active users, total job requisitions, and system health.
- **AI Usage Auditing**: Audit API token consumption, cost metrics, and request volumes.

---

## 🛠️ Technical Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router.
- **Backend**: Node.js, Express.js, Socket.IO.
- **Database**: MongoDB (Mongoose) with local JSON storage fallback (`mockDb.js`).
- **AI Core**: Google Gemini API (`@google/generative-ai`).
- **Parsing & OCR**: PDF-Parse, Mammoth (DOCX), Tesseract.js (OCR), Multer.

---

## 🚀 Quick Start Guide

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Run Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Run Frontend Application
```bash
cd client
npm install
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

© 2026 AIHireX Platform. All Rights Reserved.
