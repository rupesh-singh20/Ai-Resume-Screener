import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, FileText, Brain, Code2, Map, 
  User, Sparkles, X, ChevronRight, ArrowUpRight, Target
} from 'lucide-react';

const CommandSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'jobs', title: 'Browse Jobs & Match Scores', icon: <Briefcase size={16} />, path: '/browse-jobs', group: 'Jobs' },
    { id: 'resume', title: 'ATS Resume Intelligence', icon: <FileText size={16} />, path: '/analysis', group: 'Resume' },
    { id: 'interview-prep', title: 'Interview Preparation Hub', icon: <Brain size={16} />, path: '/applications/app_1/prep-hub', group: 'Interview' },
    { id: 'mock-interview', title: 'Start AI Mock Interview', icon: <Sparkles size={16} />, path: '/mock-interview', group: 'Interview' },
    { id: 'coding-sandbox', title: 'Coding Assessment Sandbox', icon: <Code2 size={16} />, path: '/coding-sandbox', group: 'Skills' },
    { id: 'skill-roadmap', title: 'Personalized Skill Gap Roadmap', icon: <Map size={16} />, path: '/roadmap', group: 'Skills' },
    { id: 'applications', title: 'View Active Applications Workspace', icon: <Target size={16} />, path: '/applications/app_1', group: 'Applications' },
    { id: 'recruiter', title: 'Recruiter Dashboard & Pipeline', icon: <User size={16} />, path: '/recruiter-dashboard', group: 'Recruiter' },
  ];

  const filtered = query
    ? actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.group.toLowerCase().includes(query.toLowerCase()))
    : actions;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-xl rounded-xl shadow-dropdown overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <Search size={18} className="text-gray-400 dark:text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search (e.g. jobs, interview prep, coding)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">ESC</kbd>
          <button onClick={onClose} className="p-1 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={16} />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.path)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                    <span className="text-[11px] text-gray-400 uppercase font-semibold">{item.group}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>

        {/* Command footer */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span>AIHireX Command Navigation</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1 py-0.5 text-[10px] font-mono bg-gray-200 dark:bg-gray-800 rounded">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1 py-0.5 text-[10px] font-mono bg-gray-200 dark:bg-gray-800 rounded">K</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandSearchModal;
