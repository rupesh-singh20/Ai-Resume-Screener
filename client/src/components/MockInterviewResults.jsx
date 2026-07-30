import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, 
  Brain, BarChart2, ShieldCheck, Sparkles, BookOpen
} from 'lucide-react';

const MockInterviewResults = ({ results, onPracticeAgain }) => {
  const defaultResults = {
    overallScore: 82,
    role: 'Senior Full Stack Developer (MERN)',
    round: 'Technical Architecture Round',
    metrics: [
      { name: 'Technical Knowledge', score: 86 },
      { name: 'Problem Solving', score: 80 },
      { name: 'Answer Relevance', score: 88 },
      { name: 'Communication Clarity', score: 78 },
      { name: 'Project Understanding', score: 84 },
    ],
    strengths: [
      'Articulated process.nextTick vs Promise microtask priorities clearly.',
      'Demonstrated solid understanding of MongoDB compound index ESR rules.',
      'Structured response using clear step-by-step framework.'
    ],
    weakAreas: [
      'Hesitated when explaining Docker container network isolation.',
      'Could provide more concrete numbers when discussing API caching optimization.'
    ],
    recommendedPractice: 'Complete Docker MERN containerization project and retry Technical Round simulation.'
  };

  const data = results || defaultResults;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4 border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Award size={16} />
            <span>AI Mock Interview Evaluation Report</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            {data.role}
          </h1>
          <p className="text-xs text-gray-500">{data.round} • Completed just now</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Overall Performance</span>
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{data.overallScore}%</span>
          </div>
          <button onClick={onPracticeAgain} className="btn-primary btn-sm flex items-center gap-1">
            <RefreshCw size={14} />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* Evaluation Metrics Breakdown */}
      <div className="ui-card space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Core Metric Scores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {data.metrics.map(m => (
            <div key={m.name} className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 text-center">
              <div className="text-[10px] text-gray-500 font-semibold uppercase">{m.name}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{m.score}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${m.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="ui-card space-y-3">
          <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={16} /> Verified Strengths
          </h3>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ui-card space-y-3">
          <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={16} /> Key Areas to Refine
          </h3>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            {data.weakAreas.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Next Action */}
      <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs">
          <span className="font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block mb-0.5">Recommended Next Practice</span>
          <p className="text-gray-700 dark:text-gray-300">{data.recommendedPractice}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/roadmap" className="btn-primary btn-sm">Skill Roadmap</Link>
          <button onClick={onPracticeAgain} className="btn-outline btn-sm">Try Next Round</button>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewResults;
