import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, History, FileText, TrendingUp, TrendingDown, Minus, Upload, AlertTriangle } from 'lucide-react';

const ResumeHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [histRes, resumeRes] = await Promise.allSettled([
          axios.get('/api/resumes/history'),
          axios.get('/api/resumes/latest'),
        ]);
        if (histRes.status === 'fulfilled') setHistory(histRes.value.data);
        if (resumeRes.status === 'fulfilled') setCurrent(resumeRes.value.data);
      } catch (err) {
        setError('Failed to load resume history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const ScoreDelta = ({ current, previous }) => {
    const diff = current - previous;
    if (diff > 0) return <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs"><TrendingUp size={13} />+{diff}</span>;
    if (diff < 0) return <span className="flex items-center gap-1 text-red-400 font-bold text-xs"><TrendingDown size={13} />{diff}</span>;
    return <span className="flex items-center gap-1 text-slate-500 font-bold text-xs"><Minus size={13} />0</span>;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-3">
      <div className="h-10 w-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-semibold">Loading resume history...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">Version Control</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Resume Version History</h1>
        </div>
      </div>

      {/* Current Resume Banner */}
      {current && (
        <div className="glass-panel p-5 rounded-2xl border border-indigo-900/40 bg-indigo-950/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Current Active Resume</p>
              <p className="text-sm font-bold text-white mt-0.5">{current.filename}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Uploaded: {new Date(current.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ATS Score</p>
            <span className="text-3xl font-extrabold text-gradient">{current.analysis?.score || 0}</span>
          </div>
        </div>
      )}

      {/* History Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
          <History size={16} className="text-brandPrimary" /> Previous Versions ({history.length})
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="h-14 w-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto">
              <History size={24} />
            </div>
            <p className="text-slate-400 font-semibold text-sm">No previous versions found.</p>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">Every time you re-upload your resume, the previous version is saved here for comparison.</p>
            <Link
              to="/upload-resume"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition mt-2"
            >
              <Upload size={14} /> Upload a New Version
            </Link>
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 ml-4">
            {history.map((version, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[34px] top-1 h-5 w-5 rounded-full border-4 border-[#0b0f19] bg-slate-700 group-hover:bg-brandPrimary transition-colors" />
                <div className="glass-card p-5 rounded-xl border border-slate-850 hover:border-slate-800 transition bg-slate-900/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{version.filename}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(version.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 mb-1">ATS Score</p>
                        <span className="text-xl font-extrabold text-slate-200">{version.score}</span>
                      </div>
                      {current && (
                        <ScoreDelta current={current.analysis?.score || 0} previous={version.score} />
                      )}
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full"
                      style={{ width: `${version.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2">
                    Version {history.length - idx} of {history.length} · Superseded by newer upload
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Link
          to="/upload-resume"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-sm shadow transition glow-indigo"
        >
          <Upload size={16} /> Upload New Version
        </Link>
      </div>
    </div>
  );
};

export default ResumeHistoryPage;
