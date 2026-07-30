import React, { useState } from 'react';
import { 
  Sparkles, X, Search, CheckCircle2, AlertCircle, User, 
  ArrowRight, ShieldAlert, Filter, ChevronRight
} from 'lucide-react';

const AIRecruiterCopilotModal = ({ isOpen, onClose, onSelectCandidate }) => {
  const [query, setQuery] = useState('Find backend candidates with Node.js, MongoDB and Docker who match this role.');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([
    {
      id: 'cand_1',
      name: 'Alex Morgan',
      role: 'Senior Full Stack MERN',
      overallMatch: 92,
      reasoning: [
        { criteria: 'Node.js', status: 'Matched', detail: '5 years production experience in REST APIs' },
        { criteria: 'MongoDB', status: 'Matched', detail: 'Proficient in indexing & aggregation pipelines' },
        { criteria: 'Docker', status: 'Partial Match', detail: 'Hands-on project experience in MERN sandbox' },
        { criteria: 'Experience', status: 'Matched', detail: '5+ years matches target senior tier' }
      ]
    },
    {
      id: 'cand_2',
      name: 'Sarah Chen',
      role: 'Backend Architect',
      overallMatch: 88,
      reasoning: [
        { criteria: 'Node.js', status: 'Matched', detail: '6 years experience with Express & NestJS' },
        { criteria: 'MongoDB', status: 'Matched', detail: 'Primary database across 3 companies' },
        { criteria: 'Docker', status: 'Matched', detail: 'Docker Compose & Kubernetes in production' },
        { criteria: 'Experience', status: 'Matched', detail: '6 years experience' }
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-indigo-600 text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                AI Recruiter Copilot
              </h2>
              <p className="text-xs text-gray-500">Transparent Natural Language Candidate Search</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Natural Language Search Input */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Recruiter Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Find backend candidates with Node.js, MongoDB and Docker..."
                className="ui-input text-xs"
              />
              <button onClick={handleSearch} className="btn-primary btn-sm shrink-0">
                Search Candidates
              </button>
            </div>
          </div>

          {/* AI Advisory Disclaimer Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300">
            <ShieldAlert size={16} className="shrink-0 text-amber-600" />
            <span>AI ranking provides match reasoning breakdown. It is never used as the sole hiring decision.</span>
          </div>

          {/* Candidate Search Results */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Matching Candidate Candidates ({results.length})
            </h3>

            {results.map((cand) => (
              <div key={cand.id} className="ui-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {cand.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{cand.name}</h4>
                      <p className="text-xs text-gray-500">{cand.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{cand.overallMatch}% Match</span>
                  </div>
                </div>

                {/* Transparent Reasoning Matrix */}
                <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 space-y-1 text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Transparent Reasoning:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cand.reasoning.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          r.status === 'Matched' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <div>
                          <strong className="text-gray-900 dark:text-gray-100">{r.criteria}:</strong> {r.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectCandidate(cand);
                    onClose();
                  }}
                  className="btn-outline btn-xs w-full flex items-center justify-center gap-1"
                >
                  <span>View Candidate Profile Panel</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecruiterCopilotModal;
