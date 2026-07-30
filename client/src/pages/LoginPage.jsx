import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    const demoEmail = role === 'Candidate' ? 'candidate@example.com' : 'recruiter@example.com';
    const demoPass = 'password123';
    setEmail(demoEmail);
    setPassword(demoPass);
    const result = await login(demoEmail, demoPass);
    setLoading(false);
    if (result.success) {
      navigate(role === 'Candidate' ? '/dashboard' : '/recruiter-dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 px-4 sm:px-6 relative py-12 overflow-hidden transition-colors">
      {/* Ambient background orbs */}
      <div className="orb orb-indigo h-[400px] w-[400px] top-[15%] left-[10%] animate-float-slow opacity-30 dark:opacity-40" />
      <div className="orb orb-purple h-[350px] w-[350px] bottom-[10%] right-[15%] animate-float-slower opacity-25 dark:opacity-35" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-10 animate-fade-in-up relative">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-2xl" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 mb-3 shadow-sm">
            <Sparkles size={22} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Log into your AIHireX account to continue</p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mb-6 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 text-xs">
          <div className="flex items-center justify-between font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Quick Demo One-Click Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('Candidate')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-indigo-200 dark:border-indigo-700/80 rounded-lg text-indigo-700 dark:text-indigo-300 font-semibold transition-all flex items-center justify-center gap-1 text-[11px]"
            >
              <UserCheck size={13} /> Candidate Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('Recruiter')}
              className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 border border-indigo-200 dark:border-indigo-700/80 rounded-lg text-indigo-700 dark:text-indigo-300 font-semibold transition-all flex items-center justify-center gap-1 text-[11px]"
            >
              <Briefcase size={13} /> Recruiter Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl btn-primary text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In to Account
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
