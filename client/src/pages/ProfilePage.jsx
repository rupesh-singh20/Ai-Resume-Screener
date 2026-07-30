import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Building, Globe, Save, RefreshCw, Shield, Edit3, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, isRecruiter } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState(user?.companyDetails?.name || '');
  const [companyIndustry, setCompanyIndustry] = useState(user?.companyDetails?.industry || '');
  const [companyWebsite, setCompanyWebsite] = useState(user?.companyDetails?.website || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const updateData = { name };
    if (password) updateData.password = password;
    if (isRecruiter) {
      updateData.companyDetails = {
        name: companyName,
        industry: companyIndustry,
        website: companyWebsite,
      };
    }

    const result = await updateProfile(updateData);
    setLoading(false);

    if (result.success) {
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.message || 'Failed to update profile.');
    }
  };

  const getRoleBadgeStyle = () => {
    if (user?.role === 'Admin') return 'bg-red-950/30 text-red-400 border-red-900/40';
    if (user?.role === 'Recruiter') return 'bg-pink-950/30 text-pink-400 border-pink-900/40';
    return 'bg-indigo-950/30 text-indigo-400 border-indigo-900/40';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">Account</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brandPrimary to-brandAccent flex items-center justify-center text-white font-extrabold text-3xl shadow-xl glow-indigo shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-white">{user?.name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeStyle()}`}>
              {user?.role}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold border border-emerald-900/40 bg-emerald-950/20 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={11} /> Active Account
            </span>
          </div>
          {isRecruiter && user?.companyDetails?.name && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 justify-center sm:justify-start">
              <Building size={12} /> {user.companyDetails.name}
              {user.companyDetails.industry && ` · ${user.companyDetails.industry}`}
            </p>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Edit3 size={16} className="text-brandPrimary" /> Personal Information
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#0a0e17] border border-slate-800 rounded-xl focus:outline-none focus:border-brandPrimary text-sm text-white placeholder-slate-700 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full pl-9 pr-4 py-3 bg-[#070a12] border border-slate-900 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-slate-600 mt-1">Email cannot be changed.</p>
          </div>
        </div>

        {/* Password */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-brandAccent" /> Change Password
          </h3>
          <p className="text-xs text-slate-500">Leave blank to keep your current password.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-3 bg-[#0a0e17] border border-slate-800 rounded-xl focus:outline-none focus:border-brandPrimary text-sm text-white placeholder-slate-700 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-3 bg-[#0a0e17] border border-slate-800 rounded-xl focus:outline-none focus:border-brandPrimary text-sm text-white placeholder-slate-700 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Details for Recruiters */}
        {isRecruiter && (
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Building size={16} className="text-teal-400" /> Company Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-800 rounded-xl focus:outline-none focus:border-brandPrimary text-xs text-white transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Industry</label>
                <input
                  type="text"
                  value={companyIndustry}
                  onChange={e => setCompanyIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-800 rounded-xl focus:outline-none focus:border-brandPrimary text-xs text-white transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={e => setCompanyWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0a0e17] border border-slate-800 rounded-xl focus:outline-none focus:border-brandPrimary text-xs text-white transition"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-brandPrimary hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow hover:shadow-lg transition flex items-center justify-center gap-2 glow-indigo"
        >
          {loading ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
