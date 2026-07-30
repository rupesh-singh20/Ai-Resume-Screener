import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bell, Briefcase, UserCheck, Calendar, FileText, ArrowRight, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NOTIFICATION_ICONS = {
  applied:     <Briefcase size={16} className="text-indigo-400" />,
  shortlisted: <UserCheck size={16} className="text-emerald-400" />,
  interview:   <Calendar size={16} className="text-brandAccent" />,
  resume:      <FileText size={16} className="text-teal-400" />,
};

const NotificationsPage = () => {
  const { user, isCandidate } = useAuth();
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [];
        if (isCandidate) {
          promises.push(axios.get('/api/jobs/candidate').catch(() => ({ data: [] })));
          promises.push(axios.get('/api/resumes/latest').catch(() => ({ data: null })));
        }
        const [appsRes, resumeRes] = await Promise.all(promises);
        if (appsRes) setApplications(appsRes.data || []);
        if (resumeRes) setResume(resumeRes.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isCandidate]);

  // Build notifications from activity data
  const buildNotifications = () => {
    const notifs = [];

    if (resume) {
      notifs.push({
        id: 'resume-upload',
        type: 'resume',
        title: 'Resume Analyzed Successfully',
        message: `Your resume "${resume.filename}" was parsed and scored ${resume.analysis?.score || 0}/100.`,
        time: resume.createdAt,
        link: '/analysis',
      });
    }

    applications.forEach(app => {
      const job = app.jobId;
      const jobTitle = job?.title || 'a position';
      const company = job?.company || '';

      notifs.push({
        id: `app-${app._id}`,
        type: 'applied',
        title: 'Application Submitted',
        message: `You applied to ${jobTitle}${company ? ` at ${company}` : ''}. ATS Match: ${app.score}%.`,
        time: app.appliedAt,
        link: '/dashboard',
      });

      if (app.status === 'Shortlisted') {
        notifs.push({
          id: `shortlist-${app._id}`,
          type: 'shortlisted',
          title: '🎉 You Were Shortlisted!',
          message: `Congratulations! You've been shortlisted for ${jobTitle}${company ? ` at ${company}` : ''}. Expect an interview invite.`,
          time: app.appliedAt,
          link: '/dashboard',
        });
      }
    });

    return notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const notifications = buildNotifications();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-3">
        <div className="h-10 w-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-semibold">Loading activity feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-6">
        <div>
          <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">Activity</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notifications</h1>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCheck size={14} /> {notifications.length} activities
          </div>
        )}
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto">
            <Bell size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-300">No Notifications Yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Start by uploading your resume and applying to job openings. Your activity will appear here.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/upload-resume" className="px-4 py-2 rounded-lg bg-brandPrimary text-white text-xs font-bold transition hover:bg-indigo-500">
              Upload Resume
            </Link>
            <Link to="/browse-jobs" className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-bold transition">
              Browse Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Link
              key={notif.id}
              to={notif.link || '#'}
              className="glass-card flex items-start gap-4 p-5 rounded-xl border border-slate-850 hover:border-slate-800 hover:bg-slate-900/10 transition group block"
            >
              <div className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center border
                ${notif.type === 'shortlisted' ? 'bg-emerald-950/30 border-emerald-900/40' :
                  notif.type === 'interview'   ? 'bg-pink-950/30 border-pink-900/40' :
                  notif.type === 'resume'      ? 'bg-teal-950/30 border-teal-900/40' :
                  'bg-indigo-950/30 border-indigo-900/40'
                }`}
              >
                {NOTIFICATION_ICONS[notif.type] || <Bell size={16} className="text-slate-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-100 group-hover:text-white transition">{notif.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-slate-600 mt-2 font-semibold">
                  {new Date(notif.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <ArrowRight size={14} className="text-slate-600 group-hover:text-brandPrimary transition shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
