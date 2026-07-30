import React, { useState } from 'react';
import { 
  Sparkles, X, CheckCircle2, AlertTriangle, ArrowRight, 
  Target, Zap, HelpCircle, Layers, ShieldCheck, ChevronRight
} from 'lucide-react';

const JobReadinessAnalyzerModal = ({ job, onClose, onApply }) => {
  const [dockerSimulated, setDockerSimulated] = useState(false);

  if (!job) return null;

  const baseMatch = job.matchScore || 84;
  const currentMatch = dockerSimulated ? Math.min(100, baseMatch + 8) : baseMatch;

  const skillAnalysis = [
    { name: 'Node.js', status: 'Matched', priority: 'High', rationale: 'Core requirement: Backend API architecture & async process handling.' },
    { name: 'React 18', status: 'Matched', priority: 'High', rationale: 'Frontend state management & component lifecycle proficiency.' },
    { name: 'MongoDB', status: 'Matched', priority: 'Medium', rationale: 'Primary document storage & schema design.' },
    { name: 'Docker', status: dockerSimulated ? 'Matched (Simulated)' : 'Missing', priority: 'High', rationale: 'Required because this position expects containerized deployment experience.' },
    { name: 'AWS Cloud', status: 'Recommended', priority: 'Medium', rationale: 'Bonus for deploying services onto ECS / S3 infrastructure.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles size={14} />
              <span>AI Job Readiness Analyzer</span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
              {job.title}
            </h2>
            <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Match Overview Bar */}
          <div className="ui-card bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Overall AI Match</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {currentMatch}%
                </span>
                {dockerSimulated && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    (+8% simulated improvement)
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Strong alignment on technical stack; minor gaps in deployment tooling.
              </p>
            </div>

            <button
              onClick={onApply}
              className="btn-primary btn-sm flex items-center gap-2 self-start md:self-center"
            >
              <span>Apply with Current Profile</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Detailed Categorized Readiness Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Technical</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">88%</div>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Experience</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">82%</div>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Projects</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">90%</div>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Education</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-0.5">85%</div>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">Interview</div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">78%</div>
            </div>
          </div>

          {/* Impact Simulator Tool */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Zap size={15} />
                <span>Impact Simulator (Estimate)</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dockerSimulated}
                  onChange={(e) => setDockerSimulated(e.target.checked)}
                  className="rounded border-amber-400 text-indigo-600 focus:ring-indigo-500"
                />
                Simulate adding Docker project to profile
              </label>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
              "If you demonstrate Docker experience, your estimated compatibility could improve from <strong>76% to 84%</strong> (and overall match up to 92%)."
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 italic block">
              * Note: Score predictions are probabilistic estimates generated by AIHireX parsing algorithms.
            </span>
          </div>

          {/* Skill Rationale Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Skill Rationale & Gap Breakdown
            </h3>

            <div className="space-y-2">
              {skillAnalysis.map((item) => (
                <div key={item.name} className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-gray-100">{item.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        item.status.includes('Matched') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        item.status === 'Missing' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{item.rationale}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 shrink-0">Priority: {item.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
          <button onClick={onClose} className="btn-secondary btn-sm">
            Close Analysis
          </button>
          <button onClick={onApply} className="btn-primary btn-sm flex items-center gap-2">
            <span>Proceed to Application</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobReadinessAnalyzerModal;
