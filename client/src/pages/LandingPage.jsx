import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FileUp, Brain, Target, Award, ArrowRight, Sparkles, 
  Users, BarChart3, Zap, CheckCircle2, ShieldCheck, 
  ChevronRight, Code2, Bot, FileCheck
} from 'lucide-react';

const TypewriterText = ({ text, speed = 40 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-[3px] h-[0.9em] bg-indigo-600 dark:bg-indigo-400 ml-1 animate-pulse align-middle" />}
    </span>
  );
};

const AnimatedCounter = ({ end, duration = 1800, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.max(1, Math.ceil(end / (duration / 16)));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
    if (user.role === 'Candidate') return '/dashboard';
    if (user.role === 'Recruiter') return '/recruiter-dashboard';
    return '/admin-dashboard';
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden transition-colors">
      {/* Background Ambient Orbs */}
      <div className="orb orb-indigo h-[550px] w-[550px] -top-[10%] -left-[10%] animate-mesh-move opacity-30 dark:opacity-45" />
      <div className="orb orb-purple h-[450px] w-[450px] top-[35%] -right-[5%] animate-float-slow opacity-25 dark:opacity-40" />
      <div className="orb orb-cyan h-[400px] w-[400px] bottom-[10%] left-[20%] animate-float-slower opacity-25 dark:opacity-40" />

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center z-10 my-auto flex flex-col items-center pt-6 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/50 text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300 mb-8 select-none shadow-sm dark:shadow-glow-indigo backdrop-blur-md animate-fade-in-up">
          <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span>AI-Powered Recruitment & Career Acceleration</span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight font-heading text-slate-900 dark:text-white animate-fade-in-up stagger-1">
          <TypewriterText text="Crack the Hiring Code with " speed={35} />
          <span className="text-gradient-brand dark:text-gradient-aurora">AIHireX</span>
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-10 animate-fade-in-up stagger-2">
          Automate resume screening, calculate ATS match metrics, conduct realistic interactive mock interviews with Gemini AI, and connect top talent with hiring managers effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-in-up stagger-3">
          <Link
            to={getDashboardPath()}
            className="flex items-center gap-3 px-8 py-4 rounded-xl btn-gradient-animated text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-500/20 dark:shadow-glow-indigo transition-all duration-300 hover:scale-105"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
            <ArrowRight size={20} />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base sm:text-lg transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span>Recruiter Registration</span>
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Live Interactive Hero Banner Feature Card */}
      <div className="max-w-5xl mx-auto w-full z-10 mb-16 animate-fade-in-up stagger-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-indigo-50 dark:bg-indigo-600/20 border-b border-l border-indigo-200 dark:border-indigo-500/30 rounded-bl-xl text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
            <Bot size={14} className="text-indigo-600 dark:text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Gemini AI Engine Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 rounded-md">
                Candidate & Recruiter Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                Smart Scoring, Mock Preparation & Candidate Pipeline
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you're a candidate leveling up your technical interview readiness or a recruiter evaluating hundreds of resumes, AIHireX delivers real-time AI analytics in seconds.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" /> ATS Keyword Match</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" /> AI Speech & Code Review</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" /> Automated Candidate Ranking</span>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Sample ATS Compatibility</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">94% Match</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-800 dark:text-slate-300">
                  <span>MERN Stack Alignment</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">High (10/10)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full w-[94%]" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 italic">
                  "Candidate demonstrates 5+ yrs Node.js & React architecture experience."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Statistics Bar */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 z-10 w-full mb-20 animate-fade-in-up stagger-5">
        {[
          { label: 'Resumes Analyzed', value: 10000, suffix: '+', icon: <BarChart3 size={20} className="text-indigo-600 dark:text-indigo-400" /> },
          { label: 'Mock Interviews', value: 5000, suffix: '+', icon: <Brain size={20} className="text-purple-600 dark:text-purple-400" /> },
          { label: 'Active Candidates', value: 2500, suffix: '+', icon: <Users size={20} className="text-cyan-600 dark:text-cyan-400" /> },
          { label: 'AI Match Accuracy', value: 98, suffix: '%', icon: <Zap size={20} className="text-emerald-600 dark:text-emerald-400" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 mb-2">
              {stat.icon}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Modules Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 z-10 w-full mb-16">
        {[
          {
            icon: <FileUp size={24} />,
            color: 'indigo',
            title: 'ATS Resume Scoring',
            desc: 'Upload PDF or DOCX resumes to receive detailed structural parsing, missing keyword detection, and customized bullet-point recommendations.',
            delay: 'stagger-5'
          },
          {
            icon: <Brain size={24} />,
            color: 'purple',
            title: 'AI Mock Interviews',
            desc: 'Practice role-specific interview questions powered by Gemini AI with real-time feedback, speech analysis, and sample answer improvements.',
            delay: 'stagger-6'
          },
          {
            icon: <Target size={24} />,
            color: 'emerald',
            title: 'Recruiter Candidate Workspace',
            desc: 'Post job requirements, view structured candidate applications, filter profiles by ATS scores, and dispatch automated interview invitations.',
            delay: 'stagger-7'
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${card.delay}`}
          >
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">{card.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-500 dark:text-slate-400 text-xs pt-8 border-t border-slate-200 dark:border-slate-800/60 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-300">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">AI</div>
          <span>AIHireX Platform</span>
        </div>
        <div>
          © {new Date().getFullYear()} AIHireX. Powered by MERN Stack & Google Gemini AI.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
