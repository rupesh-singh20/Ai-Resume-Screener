import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage         from './pages/LandingPage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import CandidateDashboard  from './pages/CandidateDashboard';
import ResumeUploadPage    from './pages/ResumeUploadPage';
import ResumeAnalysisPage  from './pages/ResumeAnalysisPage';
import ResumeHistoryPage   from './pages/ResumeHistoryPage';
import CoverLetterPage     from './pages/CoverLetterPage';
import MockInterviewPage   from './pages/MockInterviewPage';
import CareerRoadmapPage   from './pages/CareerRoadmapPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import InterviewPrepHubPage from './pages/InterviewPrepHubPage';
import JobsListPage        from './pages/JobsListPage';
import JobDetailPage       from './pages/JobDetailPage';
import NotificationsPage   from './pages/NotificationsPage';
import ProfilePage         from './pages/ProfilePage';
import RecruiterDashboard  from './pages/RecruiterDashboard';
import JobManagementPage   from './pages/JobManagementPage';
import CandidateRankingPage from './pages/CandidateRankingPage';
import AdminDashboard      from './pages/AdminDashboard';
import NotFoundPage        from './pages/NotFoundPage';

// AI Modules
import CareerGPTCoach      from './pages/CareerGPTCoach';
import CareerSimulator     from './pages/CareerSimulator';
import SalaryPredictor     from './pages/SalaryPredictor';
import WeeklyReport        from './pages/WeeklyReport';
import IntegrationsHub     from './pages/IntegrationsHub';
import CodingSandbox       from './pages/CodingSandbox';
import VoiceInterview      from './pages/VoiceInterview';
import CompanyIntel        from './pages/CompanyIntel';
import Marketplace         from './pages/Marketplace';
import KnowledgeGraph      from './pages/KnowledgeGraph';

// Route guard for authenticated users
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 gap-3">
        <div className="h-10 w-10 border-4 border-gray-300 dark:border-gray-800 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-semibold">Validating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Candidate') return <Navigate to="/dashboard" replace />;
    if (user.role === 'Recruiter') return <Navigate to="/recruiter-dashboard" replace />;
    if (user.role === 'Admin')     return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main layout with Navbar + Sidebar
const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />

      <div className="flex flex-grow w-full">
        {isAuthenticated && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(c => !c)}
          />
        )}

        <main className={`flex-grow w-full min-w-0 transition-all duration-300 ${isAuthenticated ? (isCollapsed ? 'lg:pl-16' : 'lg:pl-64') : ''}`}>
          <div className="pb-16 lg:pb-6">
            <Routes>
              {/* ── Public ── */}
              <Route path="/"          element={<LandingPage />} />
              <Route path="/login"     element={<LoginPage />} />
              <Route path="/register"  element={<RegisterPage />} />
              <Route path="/browse-jobs" element={<JobsListPage />} />
              <Route path="/jobs/:id"  element={<JobDetailPage />} />

              {/* ── Candidate ── */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              } />
              <Route path="/upload-resume" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <ResumeUploadPage />
                </ProtectedRoute>
              } />
              <Route path="/analysis" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <ResumeAnalysisPage />
                </ProtectedRoute>
              } />
              <Route path="/resume-history" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <ResumeHistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/cover-letter" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <CoverLetterPage />
                </ProtectedRoute>
              } />
              <Route path="/mock-interview" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <MockInterviewPage />
                </ProtectedRoute>
              } />
              <Route path="/roadmap" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <CareerRoadmapPage />
                </ProtectedRoute>
              } />
              <Route path="/applications/:id" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <ApplicationDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/applications/:id/prep-hub" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <InterviewPrepHubPage />
                </ProtectedRoute>
              } />

              {/* Candidate AI Modules */}
              <Route path="/coach" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <CareerGPTCoach />
                </ProtectedRoute>
              } />
              <Route path="/simulator" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <CareerSimulator />
                </ProtectedRoute>
              } />
              <Route path="/salary-predictor" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <SalaryPredictor />
                </ProtectedRoute>
              } />
              <Route path="/weekly-report" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <WeeklyReport />
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <IntegrationsHub />
                </ProtectedRoute>
              } />
              <Route path="/coding-sandbox" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <CodingSandbox />
                </ProtectedRoute>
              } />
              <Route path="/voice-interview" element={
                <ProtectedRoute allowedRoles={['Candidate']}>
                  <VoiceInterview />
                </ProtectedRoute>
              } />

              {/* ── Shared Authenticated ── */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/company-intel" element={
                <ProtectedRoute>
                  <CompanyIntel />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } />
              <Route path="/knowledge-graph" element={
                <ProtectedRoute>
                  <KnowledgeGraph />
                </ProtectedRoute>
              } />

              {/* ── Recruiter ── */}
              <Route path="/recruiter-dashboard" element={
                <ProtectedRoute allowedRoles={['Recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute allowedRoles={['Recruiter']}>
                  <JobManagementPage />
                </ProtectedRoute>
              } />
              <Route path="/jobs/:jobId/applicants" element={
                <ProtectedRoute allowedRoles={['Recruiter']}>
                  <CandidateRankingPage />
                </ProtectedRoute>
              } />

              {/* ── Admin ── */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* ── 404 ── */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router>
);

export default App;
