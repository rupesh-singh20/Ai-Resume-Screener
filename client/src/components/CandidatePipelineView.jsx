import React, { useState } from 'react';
import { 
  User, CheckCircle2, X, ChevronRight, Sparkles, FileText, 
  Mail, Phone, Calendar, ArrowRight, ShieldCheck
} from 'lucide-react';

const CandidatePipelineView = ({ selectedCandidateFromCopilot }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(selectedCandidateFromCopilot || null);

  const pipelineColumns = [
    'Applied', 
    'Screening', 
    'Shortlisted', 
    'Technical', 
    'HR', 
    'Offer', 
    'Hired'
  ];

  const candidateData = {
    Applied: [
      { id: 'c1', name: 'David Kim', role: 'Frontend Engineer', score: 81, exp: '3 yrs', applied: 'Today' }
    ],
    Screening: [
      { id: 'c2', name: 'Emma Watson', role: 'Full Stack MERN', score: 86, exp: '4 yrs', applied: 'Yesterday' }
    ],
    Shortlisted: [
      { id: 'c3', name: 'Sarah Chen', role: 'Backend Architect', score: 88, exp: '6 yrs', applied: '3 days ago' }
    ],
    Technical: [
      { id: 'c4', name: 'Alex Morgan', role: 'Senior Full Stack MERN', score: 92, exp: '5 yrs', applied: 'July 25' }
    ],
    HR: [
      { id: 'c5', name: 'Michael Brown', role: 'DevOps Lead', score: 85, exp: '7 yrs', applied: 'July 20' }
    ],
    Offer: [
      { id: 'c6', name: 'Jessica Taylor', role: 'Node.js Developer', score: 94, exp: '5 yrs', applied: 'July 15' }
    ],
    Hired: [
      { id: 'c7', name: 'Robert Johnson', role: 'Senior Engineer', score: 95, exp: '8 yrs', applied: 'July 10' }
    ]
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Pipeline Column Drag & Status Board */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1">
        {pipelineColumns.map((col) => {
          const list = candidateData[col] || [];
          return (
            <div key={col} className="w-64 shrink-0 bg-gray-100 dark:bg-gray-850 rounded-lg p-3 border border-gray-200 dark:border-gray-800 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{col}</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                  {list.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {list.map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800 hover:border-indigo-400 cursor-pointer shadow-subtle transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100 group-hover:text-indigo-600">
                        {cand.name}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        {cand.score}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{cand.role}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-1.5">
                      <span>Exp: {cand.exp}</span>
                      <span>{cand.applied}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-over Side Panel Drawer for Candidate Profile */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 h-full border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Slide-over Header */}
            <div className="p-5 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{selectedCandidate.name}</h3>
                  <p className="text-xs text-gray-500">{selectedCandidate.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded">
                <X size={18} />
              </button>
            </div>

            {/* Slide-over Body Details */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-600">AI Compatibility Score</span>
                  <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{selectedCandidate.score}%</div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded">
                  Shortlisted Candidate
                </span>
              </div>

              {/* Candidate Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[11px]">Candidate Info</h4>
                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 space-y-1">
                  <p><strong>Email:</strong> {selectedCandidate.name.toLowerCase().replace(' ', '.')}@example.com</p>
                  <p><strong>Experience:</strong> {selectedCandidate.exp || '5 years'}</p>
                  <p><strong>Verified Skills:</strong> React 18, Node.js, Express, MongoDB, Docker</p>
                </div>
              </div>

              {/* Stage Move Dropdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[11px]">Pipeline Stage Control</h4>
                <select className="ui-input text-xs font-semibold">
                  <option value="Technical">Technical Round (Current)</option>
                  <option value="HR">HR Round</option>
                  <option value="Offer">Extend Offer</option>
                  <option value="Hired">Mark as Hired</option>
                </select>
              </div>
            </div>

            {/* Slide-over Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
              <button onClick={() => setSelectedCandidate(null)} className="btn-secondary btn-sm">Close Panel</button>
              <button className="btn-primary btn-sm flex items-center gap-1">
                <Calendar size={14} /> Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePipelineView;
