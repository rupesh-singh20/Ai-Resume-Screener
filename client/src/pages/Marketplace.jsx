import React, { useState } from 'react';
import { Target, Shield, HelpCircle, ArrowRight, Sparkles, BookOpen, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const AGENTS_LIST = [
  { id: 'resume', name: 'Resume AI Agent', desc: 'Auto-formats layout syntax and injects industry-targeted keywords.', link: '/upload-resume' },
  { id: 'interview', name: 'Interview Coach Agent', desc: 'Conducts simulated coding and HR evaluations with ratings.', link: '/mock-interview' },
  { id: 'coding', name: 'Coding sandbox Agent', desc: 'Reviews code quality, runs test assertions, and audits time complexity.', link: '/coding-sandbox' },
  { id: 'career', name: 'Roadmap AI Agent', desc: 'Projects steps and milestone timelines towards goal titles.', link: '/simulator' },
  { id: 'negotiation', name: 'Salary Negotiation Agent', desc: 'Drafts professional counter-offers and compensation communications.', link: '/coach' },
  { id: 'salary', name: 'Salary forecast Agent', desc: 'Predicts LPA increments matching newly learned skill sets.', link: '/salary-predictor' },
  { id: 'portfolio', name: 'Portfolio Auditor Agent', desc: 'Analyzes GitHub commits and creates interactive project metrics.', link: '/integrations' }
];

const Marketplace = () => {
  const [activeAgent, setActiveAgent] = useState(null);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Agents store</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Zap className="text-brandPrimary" /> AI Agent Marketplace
          </h1>
        </div>
        <div className="px-3.5 py-2 bg-[#0c1222] border border-slate-800 rounded-xl text-[11px] text-brandAccent font-bold flex items-center gap-1.5">
          <Sparkles size={12} /> Specialization modules loaded
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS_LIST.map((agent) => (
          <div
            key={agent.id}
            className="glass-card p-6 rounded-2xl border border-slate-850 hover:border-slate-800 transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-100 group-hover:text-brandPrimary transition-colors text-sm">{agent.name}</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-950/40 border border-indigo-900/40 text-indigo-300 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">{agent.desc}</p>
            </div>

            <Link
              to={agent.link}
              className="flex items-center gap-1 text-xs text-brandPrimary hover:text-indigo-300 font-bold transition pt-4 border-t border-slate-900 self-start"
            >
              Activate Agent <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
