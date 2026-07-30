import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Briefcase, Calendar, Award, Sparkles, Search, 
  Filter, Plus, ArrowUpRight, BarChart2, ShieldCheck, ChevronRight
} from 'lucide-react';
import CandidatePipelineView from '../components/CandidatePipelineView';
import AIRecruiterCopilotModal from '../components/AIRecruiterCopilotModal';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const recruiterMetrics = {
    openJobs: 8,
    newApplicants: 42,
    candidatesInInterview: 14,
    offersMade: 3,
    timeToInterview: '4.2 Days',
  };

  const openJobsList = [
    { id: 'job_1', title: 'Senior Full Stack Developer (MERN)', applicants: 18, inInterview: 4, status: 'Active' },
    { id: 'job_2', title: 'Backend Node.js Architect', applicants: 12, inInterview: 3, status: 'Active' },
    { id: 'job_3', title: 'Frontend React Engineer', applicants: 8, inInterview: 2, status: 'Active' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Recruiter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Recruiter Command HQ & Hiring Pipeline
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage candidates, run AI copilot searches, and monitor candidate pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCopilotOpen(true)}
            className="btn-secondary btn-sm flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>AI Recruiter Copilot</span>
          </button>
          <Link to="/jobs" className="btn-primary btn-sm flex items-center gap-1">
            <Plus size={14} />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Recruiter 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-gray-500 uppercase">Open Jobs</div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{recruiterMetrics.openJobs}</div>
          <div className="text-[11px] text-gray-400">8 Active listings</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-gray-500 uppercase">New Applicants</div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{recruiterMetrics.newApplicants}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+12 this week</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-gray-500 uppercase">In Interview</div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{recruiterMetrics.candidatesInInterview}</div>
          <div className="text-[11px] text-gray-400">Across 4 rounds</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-gray-500 uppercase">Offers Out</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{recruiterMetrics.offersMade}</div>
          <div className="text-[11px] text-gray-400">2 Pending acceptance</div>
        </div>

        <div className="ui-card-subtle flex flex-col justify-between">
          <div className="text-[10px] font-semibold text-gray-500 uppercase">Avg Time to Interview</div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{recruiterMetrics.timeToInterview}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">-1.2 days faster</div>
        </div>
      </div>

      {/* Recruiter Navigation Bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs font-medium gap-2">
        {['Pipeline', 'Overview', 'Open Jobs', 'Analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === tab ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Section Content */}
      {activeTab === 'Pipeline' && (
        <CandidatePipelineView 
          selectedCandidateFromCopilot={selectedCandidate}
        />
      )}

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 ui-card space-y-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Active Requisitions Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3 font-semibold">Job Title</th>
                    <th className="py-2.5 px-3 font-semibold">Applicants</th>
                    <th className="py-2.5 px-3 font-semibold">In Interview</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {openJobsList.map(j => (
                    <tr key={j.id} className="hover:bg-gray-50 dark:hover:bg-gray-850">
                      <td className="py-3 px-3 font-bold text-gray-900 dark:text-gray-100">{j.title}</td>
                      <td className="py-3 px-3 font-semibold text-indigo-600">{j.applicants}</td>
                      <td className="py-3 px-3 font-semibold text-purple-600">{j.inInterview}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {j.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link to={`/jobs/${j.id}/applicants`} className="btn-outline btn-xs">
                          Manage Pipeline
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Quick Copilot Search
            </h2>
            <p className="text-xs text-gray-500">Search top applicants with transparent AI reasoning.</p>
            <button onClick={() => setCopilotOpen(true)} className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5">
              <Sparkles size={14} /> Open AI Copilot Search
            </button>
          </div>
        </div>
      )}

      {/* Copilot Modal */}
      <AIRecruiterCopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onSelectCandidate={(cand) => {
          setSelectedCandidate(cand);
          setActiveTab('Pipeline');
        }}
      />
    </div>
  );
};

export default RecruiterDashboard;
