import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft, Award, Sparkles, UserCheck, Calendar,
  MailCheck, RefreshCw, AlertTriangle, X
} from 'lucide-react';

const CandidateRankingPage = () => {
  const { jobId } = useParams();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApp, setSelectedApp] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [shortlisting, setShortlisting] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.allSettled([
        axios.get(`/api/jobs/${jobId}`),
        axios.get(`/api/jobs/${jobId}/rank`)
      ]);
      if (jobRes.status === 'fulfilled') setJob(jobRes.value.data);
      if (appsRes.status === 'fulfilled') setApplicants(appsRes.value.data || []);
    } catch {
      toast.error('Could not fetch applicant lists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [jobId]);

  const handleShortlist = async (appId) => {
    setShortlisting(appId);
    try {
      await axios.put(`/api/jobs/application/${appId}/shortlist`);
      setApplicants(prev => prev.map(app =>
        app._id === appId ? { ...app, status: 'Shortlisted' } : app
      ));
      toast.success('Candidate shortlisted and email notification sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to shortlist applicant.');
    } finally {
      setShortlisting(null);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!date || !time || !link || scheduling) return;
    setScheduling(true);
    try {
      await axios.post(`/api/jobs/application/${selectedApp._id}/interview`, { date, time, link });
      toast.success('Interview scheduled! Email dispatched to candidate.');
      setModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-3">
      <div className="h-10 w-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-semibold">Gemini AI is ranking candidates...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/recruiter-dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">Screening Room</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Candidate Ranking</h1>
        </div>
      </div>

      {job && (
        <div className="glass-panel p-5 rounded-xl border border-slate-800 bg-[#0e1628]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Position</p>
            <h2 className="text-lg font-bold text-slate-200 mt-0.5">{job.title}</h2>
            <p className="text-xs text-brandAccent font-semibold mt-0.5">{job.company} · {job.location}</p>
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-bold text-2xl text-white">{applicants.length}</span> Applicants
          </div>
        </div>
      )}

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-1.5">
          <Sparkles size={16} className="text-brandPrimary animate-float" /> AI-Ranked Applicants
        </h3>

        {applicants.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No candidates have applied to this position yet.
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.map((app, index) => (
              <div
                key={app._id}
                className="glass-card p-5 rounded-xl border border-slate-850 hover:border-slate-800 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Rank + Candidate Info */}
                <div className="flex items-center gap-4">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 
                    ${index === 0 ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' :
                      index === 1 ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                      index === 2 ? 'bg-orange-950/30 text-orange-400 border border-orange-900/30' :
                      'bg-slate-900 text-slate-500 border border-slate-800'}`}
                  >
                    #{app.rank || index + 1}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-100">{app.candidateId?.name || 'Candidate'}</p>
                    <p className="text-[10px] text-slate-500">{app.candidateId?.email}</p>
                    <p className="text-[10px] text-slate-600 mt-1 line-clamp-1 max-w-xs">{app.reason || app.summary}</p>
                  </div>
                </div>

                {/* Score + Actions */}
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  {/* ATS Score Badge */}
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">ATS Score</p>
                    <span className={`text-xl font-extrabold ${
                      (app.aiScore || app.score) >= 80 ? 'text-emerald-400' :
                      (app.aiScore || app.score) >= 60 ? 'text-indigo-400' : 'text-red-400'
                    }`}>
                      {app.aiScore || app.score}%
                    </span>
                  </div>

                  {/* Status badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    app.status === 'Shortlisted' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' :
                    app.status === 'Rejected'    ? 'bg-red-950/30 text-red-400 border-red-900/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {app.status}
                  </span>

                  {/* Action Buttons */}
                  {app.status !== 'Shortlisted' && (
                    <button
                      onClick={() => handleShortlist(app._id)}
                      disabled={shortlisting === app._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-900/50 hover:bg-emerald-950/20 text-slate-300 hover:text-emerald-400 font-bold text-[11px] transition disabled:opacity-40"
                    >
                      {shortlisting === app._id ? <RefreshCw size={12} className="animate-spin" /> : <UserCheck size={12} />}
                      Shortlist
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedApp(app); setDate(''); setTime(''); setLink(''); setModalOpen(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-[11px] shadow transition"
                  >
                    <Calendar size={12} /> Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interview Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition">
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Calendar size={20} className="text-brandPrimary" /> Schedule Interview
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              For <strong className="text-slate-300">{selectedApp?.candidateId?.name}</strong> · {job?.title}
            </p>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Date</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brandPrimary transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Time</label>
                  <input type="text" required value={time} placeholder="e.g. 3:00 PM EST" onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090e1a] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brandPrimary transition" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Meeting Link</label>
                <input type="url" required value={link} placeholder="https://zoom.us/j/..." onChange={e => setLink(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090e1a] border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-brandPrimary transition" />
              </div>
              <button type="submit" disabled={scheduling}
                className="w-full py-3 mt-2 rounded-xl bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-xs shadow hover:shadow-lg transition flex items-center justify-center gap-1.5 glow-indigo disabled:opacity-40"
              >
                {scheduling ? <><RefreshCw size={14} className="animate-spin" /> Scheduling...</> : <><MailCheck size={14} /> Confirm & Notify Candidate</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRankingPage;
