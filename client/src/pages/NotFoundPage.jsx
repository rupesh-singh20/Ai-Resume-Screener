import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'Candidate') return '/dashboard';
    if (user?.role === 'Recruiter') return '/recruiter-dashboard';
    return '/admin-dashboard';
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-[#0b0f19] px-6 relative">
      <div className="absolute top-1/3 left-1/2 h-96 w-96 rounded-full bg-brandPrimary/5 blur-[120px] pointer-events-none -translate-x-1/2" />

      <div className="text-center z-10 max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="text-[160px] font-extrabold leading-none select-none text-slate-900 animate-pulse-soft">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search size={48} className="text-brandPrimary animate-float" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Check the URL or navigate back to a known page.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            to={getDashboardPath()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-sm shadow glow-indigo transition"
          >
            <Home size={16} /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-sm transition"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
