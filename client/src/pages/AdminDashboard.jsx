import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserCheck, ShieldAlert, BarChart3, HelpCircle, 
  Trash2, Mail, AlertTriangle, ShieldCheck, Activity 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      const [metricsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/users')
      ]);
      setMetrics(metricsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      setError('Could not load administrative console profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is permanent.')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-3">
        <div className="h-10 w-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-semibold">Retrieving Administrative Metrics...</p>
      </div>
    );
  }

  const summary = metrics?.summary || {};

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-6">
        <div>
          <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">System Administration</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Control Panel</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Grid count cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: 'Candidates', val: summary.totalCandidates || 0, color: 'text-indigo-400' },
          { label: 'Recruiters', val: summary.totalRecruiters || 0, color: 'text-pink-400' },
          { label: 'Total Jobs', val: summary.totalJobs || 0, color: 'text-teal-400' },
          { label: 'Resumes Parsed', val: summary.totalResumes || 0, color: 'text-purple-400' },
          { label: 'Applications', val: summary.totalApplications || 0, color: 'text-emerald-400' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
            <span className={`text-2xl font-extrabold mt-2 ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest mb-6 flex items-center gap-1.5">
            <Activity size={16} className="text-brandPrimary" /> Gemini AI request traffic
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.dailyAiRequests || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest mb-4">System Node status</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/40 border border-slate-850">
                <span className="font-semibold text-slate-400">Node API Cluster</span>
                <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-emerald-950/20 text-emerald-400 border border-emerald-900/30">ONLINE</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/40 border border-slate-850">
                <span className="font-semibold text-slate-400">Database Proxy Layer</span>
                <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-emerald-950/20 text-emerald-400 border border-emerald-900/30">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/40 border border-slate-850">
                <span className="font-semibold text-slate-400">OCR Parser Core</span>
                <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-emerald-950/20 text-emerald-400 border border-emerald-900/30">STANDBY</span>
              </div>
            </div>
          </div>

          <div className="p-3 text-[10px] text-brandAccent bg-pink-950/15 border border-pink-900/35 rounded-lg flex gap-2 mt-4">
            <ShieldCheck size={16} className="shrink-0" />
            <span>Administrator sandbox operations active. Audit trails are logged to console.</span>
          </div>
        </div>
      </div>

      {/* User Management List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest mb-6">User Accounts Management</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase">
                <th className="pb-3 pl-2">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Created Date</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/5 transition">
                  <td className="py-3 pl-2 font-extrabold text-slate-200">{u.name}</td>
                  <td className="py-3 text-slate-400 flex items-center gap-1.5 mt-1 border-none">
                    <Mail size={12} className="text-slate-650 shrink-0" />
                    <span>{u.email}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      u.role === 'Admin' ? 'bg-red-950/30 text-red-400 border border-red-900/30' :
                      u.role === 'Recruiter' ? 'bg-pink-950/30 text-pink-400 border border-pink-900/30' :
                      'bg-indigo-950/30 text-indigo-400 border border-indigo-900/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right pr-2">
                    {u.role !== 'Admin' ? (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-red-900/50 hover:bg-red-950/20 text-slate-500 hover:text-red-400 transition"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-semibold italic">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
