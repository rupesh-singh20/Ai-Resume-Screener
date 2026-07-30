# AI Resume Screening & Recruitment Platform

An AI-powered Resume Screening & Recruitment Platform built using the MERN Stack and Google Gemini AI. The platform helps job seekers optimize their resumes for ATS (Applicant Tracking Systems) and practice mock interviews, while enabling recruiters to efficiently screen, rank, and manage candidates.

## Features

### Candidate Module
- **Secure Authentication**: JWT-based login & signup.
- **Resume Upload & Parsing**: Parse PDF/DOCX resumes automatically using text parsers or OCR (Tesseract.js).
- **ATS Resume Score**: Real-time evaluation (0-100) based on industry standards.
- **AI Career Assistance**: Get missing skills analysis, career recommendations, and customized learning roadmaps.
- **AI Materials**: Generate cover letters and tailored resume summaries.
- **Interactive Mock Interview**: Run a simulated interview with real-time feedback on your answers.
- **Applied Jobs Tracker**: Apply for recruiter postings and check status.

### Recruiter Module
- **Job Openings Workspace**: Create, publish, and manage job specifications.
- **Smart Candidate Ranking**: Sort and filter applicants by ATS compatibility score.
- **Email Dispatcher**: Email shortlisted candidates directly from the dashboard.
- **Recruitment Analytics**: Visualize applicant metrics, score distributions, and hiring funnels.

### Admin Module
- **Platform Management**: Monitor total users, job listings, and system health.
- **AI usage auditing**: Track API costs and request volumes.

---

## Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose) with a local JSON file-based database fallback (`mockDb.js`) if no active MongoDB connection string is provided in `.env`.
- **AI Core**: Google Gemini API via `@google/generative-ai`.
- **File Handling**: PDF-Parse, Mammoth (DOCX), Tesseract.js (OCR), Multer.

---

## Getting Started

### 1. Configure Environment Variables
Create or open the `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string (Optional - defaults to local JSON storage if empty)
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key (Required for AI features)
```

### 2. Install and Run the Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Install and Run the React Frontend Client
```bash
cd client
npm install
npm run dev
```
The React dev server will run on `http://localhost:5173`. Any requests to `/api` will be proxied to the backend at `http://localhost:5000`.
