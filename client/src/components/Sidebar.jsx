import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Search, FileText, Brain, Code2, Map, 
  Briefcase, Bell, User, Settings, HelpCircle, MessageSquare,
  ChevronLeft, ChevronRight, Target, Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const { user } = useAuth();

  const getCandidateNavItems = () => [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/browse-jobs', label: 'Jobs', icon: <Search size={18} /> },
    { path: '/applications/app_1', label: 'Applications', icon: <Target size={18} /> },
    { path: '/analysis', label: 'Resume', icon: <FileText size={18} /> },
    { path: '/applications/app_1/prep-hub', label: 'Interview Prep', icon: <Brain size={18} /> },
    { path: '/coding-sandbox', label: 'Skill Development', icon: <Code2 size={18} /> },
    { path: '/roadmap', label: 'Career', icon: <Map size={18} /> },
    { path: '/coach', label: 'Messages', icon: <MessageSquare size={18} /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const getRecruiterNavItems = () => [
    { path: '/recruiter-dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
    { path: '/jobs/job_1/applicants', label: 'Candidates & Pipeline', icon: <User size={18} /> },
    { path: '/coach', label: 'Messages', icon: <MessageSquare size={18} /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const getAdminNavItems = () => [
    { path: '/admin-dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/browse-jobs', label: 'Platform Jobs', icon: <Search size={18} /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const items = user?.role === 'Recruiter' ? getRecruiterNavItems() :
                user?.role === 'Admin' ? getAdminNavItems() : getCandidateNavItems();

  const bottomItems = [
    { path: '/profile', label: 'Settings', icon: <Settings size={18} /> },
    { path: '/coach', label: 'Help', icon: <HelpCircle size={18} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar Desktop Shell */}
      <aside 
        className={`
          fixed top-[57px] bottom-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col justify-between py-3 px-2
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col gap-1 overflow-y-auto overflow-x-hidden flex-grow">
          {/* Section Label */}
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {user?.role === 'Recruiter' ? 'Recruiter Navigation' : 'Candidate Workspace'}
            </div>
          )}

          {/* Navigation Links */}
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-indigo-600 dark:bg-indigo-400" />
                  )}
                  <span className={`shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex flex-col gap-1 shrink-0">
          {bottomItems.map((bItem) => (
            <NavLink
              key={bItem.path}
              to={bItem.path}
              onClick={onClose}
              title={isCollapsed ? bItem.label : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }
              `}
            >
              <span className="text-gray-500 dark:text-gray-400 shrink-0">{bItem.icon}</span>
              {!isCollapsed && <span className="truncate">{bItem.label}</span>}
            </NavLink>
          ))}

          {/* User Profile Card at Sidebar Bottom */}
          <div className={`mt-2 p-2 rounded-md bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name || 'Candidate Account'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.role || 'Candidate'}</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button (Desktop) */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-full py-1.5 mt-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 border-t border-gray-200 dark:border-gray-800"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2"><ChevronLeft size={16} /><span>Collapse Sidebar</span></div>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar for quick navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around py-2 px-1 lg:hidden">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500'}`}>
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/browse-jobs" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500'}`}>
          <Search size={18} />
          <span>Jobs</span>
        </NavLink>
        <NavLink to="/applications/app_1" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500'}`}>
          <Target size={18} />
          <span>Apps</span>
        </NavLink>
        <NavLink to="/mock-interview" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500'}`}>
          <Brain size={18} />
          <span>Prep</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center text-[10px] ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500'}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
