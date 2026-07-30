import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Briefcase, Search, Moon, Sun, Bell, User, LogOut, 
  Menu, ChevronRight, Sparkles, SlidersHorizontal, Shield
} from 'lucide-react';
import CommandSearchModal from './CommandSearchModal';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAuthenticated, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [commandModalOpen, setCommandModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumb path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleRoleToggle = async () => {
    if (!user) return;
    const nextRole = user.role === 'Candidate' ? 'Recruiter' : 'Candidate';
    await updateProfile({ role: nextRole });
    if (nextRole === 'Recruiter') navigate('/recruiter-dashboard');
    else navigate('/dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/80 h-[57px] flex items-center justify-between px-4 sm:px-6 transition-colors">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-gray-100 font-heading font-extrabold leading-none text-base">
                AIHire<span className="text-indigo-600 dark:text-indigo-400">X</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-0.5">
                AI Platform
              </span>
            </div>
          </Link>

          {/* Desktop Breadcrumb Navigation */}
          {isAuthenticated && pathnames.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-gray-200 dark:border-gray-800 text-xs text-gray-500">
              <span>Platform</span>
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return (
                  <React.Fragment key={routeTo}>
                    <ChevronRight size={12} className="text-gray-400" />
                    <Link
                      to={routeTo}
                      className={`capitalize ${isLast ? 'font-semibold text-gray-900 dark:text-gray-200' : 'hover:text-gray-800 dark:hover:text-gray-300'}`}
                    >
                      {name.replace('-', ' ')}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2">
          {/* Command Search Trigger Button */}
          {isAuthenticated && (
            <button
              onClick={() => setCommandModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700/80 transition-colors mr-1"
            >
              <Search size={14} />
              <span>Search platform...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">Ctrl K</kbd>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications Link */}
              <Link
                to="/notifications"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                title="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-gray-900" />
              </Link>

              {/* Role Switcher Demo Pill */}
              <button
                onClick={handleRoleToggle}
                className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
                title="Toggle between Candidate & Recruiter mode"
              >
                <SlidersHorizontal size={13} />
                <span>Mode: {user?.role || 'Candidate'}</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative ml-1">
                <button
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl py-1.5 z-50 animate-fade-in-up"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 rounded border border-indigo-200 dark:border-indigo-800/60">
                        {user?.role} Account
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <User size={14} /> Profile & Settings
                    </Link>

                    <button
                      onClick={handleRoleToggle}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                    >
                      <SlidersHorizontal size={14} /> Switch to {user?.role === 'Candidate' ? 'Recruiter' : 'Candidate'} View
                    </button>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                    <button
                      onClick={() => { logout(); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </header>

      {/* Command Search Modal */}
      <CommandSearchModal
        isOpen={commandModalOpen}
        onClose={() => setCommandModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
