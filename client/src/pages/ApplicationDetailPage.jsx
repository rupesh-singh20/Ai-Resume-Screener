import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Target, Brain, Code2, FileText, Clock, CheckCircle2, 
  Sparkles, BookOpen, ChevronRight, ArrowRight, ShieldCheck
} from 'lucide-react';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const appData = {
    id: id || 'app_1',
    jobTitle: 'Senior Full Stack Developer (MERN)',
    company: 'TechCorp Solutions',
    status: 'Interview Scheduled',
    stage: 'Technical Round',
    matchScore: 92,
    interviewDate: 'Friday, August 7, 2026',
    appliedDate: 'July 25, 2026',
    timeline: [
      { date: 'July 25, 2026', title: 'Application Submitted', desc: 'Resume & portfolio submitted successfully' },
      { date: 'July 27, 2026', title: 'Resume Screened', desc: 'ATS Score 88% - Candidate shortlisted' },
      { date: 'July 29, 2026', title: 'Technical Interview Scheduled', desc: 'Invited for 45-min live technical architecture round' },
      { date: 'August 7, 2026', title: 'Upcoming Interview', desc: 'Node.js & React System Architecture' }
    ]
  };

  const tabs = [
    'Overview', 
    'Preparation', 
    'Questions', 
    'Mock Interview', 
    'Coding', 
    'Skills', 
    'Documents', 
    'Timeline'
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Target size={14} />
            <span>Dedicated Application Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            {appData.jobTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {appData.company} • Applied {appData.appliedDate} • Stage: <span className="font-semibold text-emerald-600">{appData.stage}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-gray-400 block">AI Match</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{appData.matchScore}% Score</span>
          </div>
          <Link to={`/applications/${appData.id}/prep-hub`} className="btn-primary btn-sm flex items-center gap-1">
            <Brain size={14} />
            <span>Open Prep Hub</span>
          </Link>
        </div>
      </div>

      {/* 8-Tab Workspace Navigation Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex items-center gap-1 overflow-x-auto text-xs font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 ui-card space-y-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Application Status & Next Action</h2>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>Current Stage: Technical Interview Scheduled</span>
                  <span>Date: {appData.interviewDate}</span>
                </div>
                <p className="text-emerald-900/80 dark:text-emerald-300/80">
                  Prepare for Node.js event loop, React state synchronization, and Docker deployment questions.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">Recommended Preparation Steps:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">15-min AI Mock Technical Round</div>
                    <p className="text-gray-500 text-[11px] mt-0.5">Practice Node.js microservice architecture questions.</p>
                    <Link to="/mock-interview" className="text-indigo-600 font-semibold mt-2 inline-block">Start Mock →</Link>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">Coding Sandbox Practice</div>
                    <p className="text-gray-500 text-[11px] mt-0.5">Solve async concurrency & array algorithms.</p>
                    <Link to="/coding-sandbox" className="text-indigo-600 font-semibold mt-2 inline-block">Open Sandbox →</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="ui-card space-y-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Quick Actions</h2>
              <Link to={`/applications/${appData.id}/prep-hub`} className="btn-primary w-full text-xs text-center block py-2">
                Question Preparation Hub
              </Link>
              <Link to="/roadmap" className="btn-outline w-full text-xs text-center block py-2">
                Review Skill Gap Roadmap
              </Link>
              <Link to="/analysis" className="btn-secondary w-full text-xs text-center block py-2">
                View Submitted Resume
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'Preparation' && (
          <div className="ui-card space-y-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Interview Preparation Strategy</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Personalized prep strategy based on TechCorp's job description and past interview patterns.
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
                <div className="font-bold text-gray-900 dark:text-gray-100">1. System Architecture Focus (High Weight)</div>
                <p className="text-gray-500 mt-0.5">Expect questions on REST API design, MongoDB indexing, and Redis session caching.</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
                <div className="font-bold text-gray-900 dark:text-gray-100">2. Behavior & STAR Framework</div>
                <p className="text-gray-500 mt-0.5">Prepare 2 project examples showing how you resolved production bottlenecks.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Questions' && (
          <div className="ui-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Role & Resume Questions</h2>
              <Link to={`/applications/${appData.id}/prep-hub`} className="text-xs text-indigo-600 font-semibold hover:underline">Full Prep Hub →</Link>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Q: How do you handle asynchronous error propagation in Node.js Express middleware?</div>
                <p className="text-gray-500 text-[11px] mt-1">Suggested structure: express-async-errors, central error handler, status code mapping.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Mock Interview' && (
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">AI Mock Technical Round</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Launch a dynamic simulated interview tailored for {appData.jobTitle}.</p>
            <Link to="/mock-interview" className="btn-primary btn-sm inline-flex items-center gap-2">
              <Brain size={14} /> Start Technical Round Simulation
            </Link>
          </div>
        )}

        {activeTab === 'Coding' && (
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Integrated Coding Sandbox</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Practice MERN algorithms and API implementations with real-time test runners.</p>
            <Link to="/coding-sandbox" className="btn-primary btn-sm inline-flex items-center gap-2">
              <Code2 size={14} /> Launch Coding Sandbox
            </Link>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Required Skills Gap Analysis</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded">Node.js (Matched)</span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded">React 18 (Matched)</span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold rounded">Docker (Missing - High Priority)</span>
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Submitted Package & Attachments</h2>
            <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Resume_Senior_MERN_2026.pdf</span>
              </div>
              <span className="text-[11px] text-gray-400">Submitted July 25</span>
            </div>
          </div>
        )}

        {activeTab === 'Timeline' && (
          <div className="ui-card space-y-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Application Journey Timeline</h2>
            <div className="space-y-4 pl-4 border-l-2 border-indigo-600 text-xs">
              {appData.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <div className="font-bold text-gray-900 dark:text-gray-100">{event.title}</div>
                  <div className="text-[11px] text-gray-400">{event.date}</div>
                  <p className="text-gray-600 dark:text-gray-300 mt-0.5">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
