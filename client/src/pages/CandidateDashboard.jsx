import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, FileText, Brain, Code2, Map, Target, 
  ArrowRight, CheckCircle2, Clock, AlertCircle, Sparkles,
  TrendingUp, Compass, Award, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AICareerAssistantDrawer from '../components/AICareerAssistantDrawer';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Core 6 Metrics
  const metrics = {
    careerReadiness: 86,
    resumeScore: 84,
    jobMatch: 92,
    interviewReadiness: 78,
    codingReadiness: 82,
    skillProgress: 75
  };

  // Recent applications (compact table format)
  const applications = [
    {
      id: 'app_1',
      jobTitle: 'Senior Full Stack Developer (MERN)',
      company: 'TechCorp Solutions',
      status: 'Interview Scheduled',
      stage: 'Technical Round',
      matchScore: 92,
      appliedDate: '2026-07-25',
      nextAction: '15-min Node.js Mock Interview',
      actionUrgency: 'High',
      deadline: '2026-08-02'
    },
    {
      id: 'app_2',
      jobTitle: 'Backend Node.js Architect',
      company: 'CloudScale Inc.',
      status: 'Under Review',
      stage: 'Screening',
      matchScore: 88,
      appliedDate: '2026-07-28',
      nextAction: 'Add Docker experience to resume',
      actionUrgency: 'Medium',
      deadline: '2026-08-05'
    },
    {
      id: 'app_3',
      jobTitle: 'Frontend Engineer (React & TypeScript)',
      company: 'InnoTech Labs',
      status: 'Assessment Sent',
      stage: 'Coding Test',
      matchScore: 85,
      appliedDate: '2026-07-22',
      nextAction: 'Complete React & Algorithm Sandbox Test',
      actionUrgency: 'High',
      deadline: '2026-07-31'
    }
  ];

  // Matched jobs quick preview
  const matchedJobs = [
    { id: 'job_1', title: 'Senior Full Stack Developer', company: 'TechCorp', salary: '$130k - $160k', location: 'Remote', match: 92, skills: ['React', 'Node.js', 'MongoDB', 'Docker'] },
    { id: 'job_2', title: 'Lead Backend Engineer', company: 'DataPulse', salary: '$140k - $175k', location: 'San Francisco, CA (Hybrid)', match: 89, skills: ['Node.js', 'Express', 'Redis', 'AWS'] },
    { id: 'job_3', title: 'React Frontend Architect', company: 'Nexus Digital', salary: '$125k - $155k', location: 'Remote', match: 86, skills: ['React', 'TypeScript', 'Tailwind', 'Vite'] },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Compass size={14} />
            <span>Career Journey & Readiness HQ</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Welcome back, {user?.name || 'Candidate'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            You are in Stage 3: <span className="font-semibold text-gray-800 dark:text-gray-200">Active Interviewing & Skill Elevation</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAssistantOpen(true)}
            className="btn-secondary btn-sm flex items-center gap-2"
          >
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>AI Assistant</span>
          </button>
          <Link to="/browse-jobs" className="btn-primary btn-sm flex items-center gap-2">
            <span>Explore Jobs</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Prominent Next Best Action Card */}
      <div className="bg-indigo-900/10 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
            <Target size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white rounded">
                Next Best Action
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Priority: High</span>
            </div>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
              Your application for <span className="underline text-indigo-600 dark:text-indigo-400">Senior Full Stack Developer</span> at TechCorp has progressed to Technical Round.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Recommended: Complete a 15-minute Node.js mock interview before Friday to boost your interview readiness from 78% to 88%.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/applications/app_1/prep-hub" className="btn-primary btn-sm">
            Launch Mock Interview
          </Link>
          <Link to="/applications/app_1" className="btn-outline btn-sm">
            View Workspace
          </Link>
        </div>
      </div>

      {/* 5 Core Career Answers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">1. Career Journey</div>
          <div className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">Stage 3</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">86% Overall Readiness</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">2. Next Action</div>
          <div className="mt-2 text-sm font-bold text-gray-900 dark:text-gray-100 truncate">Node.js Mock Prep</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Due in 2 days</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">3. Top Job Match</div>
          <div className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">92% Match</div>
          <div className="text-xs text-gray-500 truncate">TechCorp Solutions</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">4. Apps Needing Attention</div>
          <div className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">2 Actions</div>
          <div className="text-xs text-gray-500 truncate">1 Test, 1 Interview</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">5. Interview Ready?</div>
          <div className="mt-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">78% Score</div>
          <div className="text-xs text-gray-500">Good (Needs System Design)</div>
        </div>
      </div>

      {/* 6 Score Indicators Grid */}
      <div className="ui-card space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Core Readiness & Performance Indicators
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Career Score</span>
              <Compass size={14} className="text-indigo-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{metrics.careerReadiness}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${metrics.careerReadiness}%` }} />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Resume Score</span>
              <FileText size={14} className="text-blue-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{metrics.resumeScore}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${metrics.resumeScore}%` }} />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Job Match</span>
              <Briefcase size={14} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.jobMatch}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${metrics.jobMatch}%` }} />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Interview</span>
              <Brain size={14} className="text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{metrics.interviewReadiness}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${metrics.interviewReadiness}%` }} />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Coding</span>
              <Code2 size={14} className="text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{metrics.codingReadiness}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${metrics.codingReadiness}%` }} />
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Skill Progress</span>
              <TrendingUp size={14} className="text-cyan-500" />
            </div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{metrics.skillProgress}%</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${metrics.skillProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Applications Table & Matched Jobs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Compact Applications Timeline & Table */}
        <div className="lg:col-span-2 ui-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Active Applications Workspace
              </h2>
            </div>
            <span className="text-xs text-gray-500">Showing {applications.length} active pipelines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 uppercase text-[10px]">
                  <th className="py-2 px-3 font-semibold">Job & Company</th>
                  <th className="py-2 px-3 font-semibold">Status & Stage</th>
                  <th className="py-2 px-3 font-semibold">AI Match</th>
                  <th className="py-2 px-3 font-semibold">Next Required Action</th>
                  <th className="py-2 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-850/50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{app.jobTitle}</div>
                      <div className="text-gray-500 text-[11px]">{app.company} • Applied {app.appliedDate}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        app.status === 'Interview Scheduled' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        app.status === 'Assessment Sent' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {app.status}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-0.5">{app.stage}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {app.matchScore}%
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[180px]">{app.nextAction}</div>
                      <div className="text-[10px] text-gray-400">Deadline: {app.deadline}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link 
                        to={`/applications/${app.id}`} 
                        className="btn-outline btn-xs inline-flex items-center gap-1"
                      >
                        <span>Workspace</span>
                        <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: High Match Jobs Quick Queue */}
        <div className="ui-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              High Match Openings
            </h2>
            <Link to="/browse-jobs" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {matchedJobs.map((job) => (
              <div key={job.id} className="p-3 bg-gray-50 dark:bg-gray-850 rounded-md border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="text-xs font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600">
                      {job.title}
                    </Link>
                    <p className="text-[11px] text-gray-500">{job.company} • {job.location}</p>
                  </div>
                  <span className="px-1.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 rounded">
                    {job.match}% Match
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {job.skills.map(s => (
                    <span key={s} className="px-1.5 py-0.5 text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{job.salary}</span>
                  <Link to={`/jobs/${job.id}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Quick Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <AICareerAssistantDrawer 
        isOpen={assistantOpen} 
        onClose={() => setAssistantOpen(false)} 
      />
    </div>
  );
};

export default CandidateDashboard;
