import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, ArrowLeft, TrendingUp, BookOpen, AlertTriangle, Briefcase, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const WeeklyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('/api/ai/weekly-report');
        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-3">
      <div className="h-10 w-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-semibold">Generating Sunday Report Card...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Digest</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Award size={22} className="text-amber-400 animate-pulse" /> AI Weekly Career Report
          </h1>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Main summary card */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-indigo-900/40 bg-indigo-950/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Sunday Performance Review</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Excellent Progress This Week!</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
                Your profile rating is rising. By solving challenges, learning skills, and testing interviews, your market readiness metric reached **{report.readinessScore}%**.
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interview Readiness</span>
              <p className="text-5xl font-black text-indigo-400 mt-1">{report.readinessScore}%</p>
            </div>
          </div>

          {/* Grid counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 1. Resume Improvement */}
            <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resume Optimize Rate</p>
              <p className="text-2xl font-extrabold text-emerald-400">{report.scoreImprovement}</p>
              <p className="text-[10px] text-slate-500">Compared to initial upload state</p>
            </div>

            {/* 2. DSA questions */}
            <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DSA Challenges Solved</p>
              <p className="text-2xl font-extrabold text-white">{report.dsaQuestionsSolved}</p>
              <p className="text-[10px] text-slate-500">Solved inside Coding Sandbox</p>
            </div>

            {/* 3. Matching jobs */}
            <div className="glass-card p-6 rounded-2xl border border-slate-850 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Matching Jobs Found</p>
              <p className="text-2xl font-extrabold text-white">{report.matchingJobsCount}</p>
              <p className="text-[10px] text-slate-500">Available to browse & apply</p>
            </div>
          </div>

          {/* Details list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills parsed */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="text-brandAccent" size={14} /> Skills Acquired This Week
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.skillsLearned.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 text-xs font-bold bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Market Demand Trend */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="text-amber-400" size={14} /> Market Demand Signals
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 border border-slate-850 p-4 rounded-xl">
                {report.marketDemandChange}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
