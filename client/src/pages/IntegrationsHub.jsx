import React, { useState } from 'react';
import { GitBranch, Linkedin, ArrowLeft, RefreshCw, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IntegrationsHub = () => {
  const [githubUser, setGithubUser] = useState('');
  const [linkedinUser, setLinkedinUser] = useState('');
  const [githubData, setGithubData] = useState(null);
  const [linkedinData, setLinkedinData] = useState(null);
  const [loadingGit, setLoadingGit] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);

  const handleSyncGithub = (e) => {
    e.preventDefault();
    if (!githubUser.trim() || loadingGit) return;
    setLoadingGit(true);
    setTimeout(() => {
      setGithubData({
        commitsCount: 342,
        pullRequests: 58,
        issueActivity: 'High (12 resolved)',
        docQuality: 'Excellent (A- Grade)',
        codeQualityScore: 89,
        consistency: 'Active (Daily commits for 24 consecutive days)',
        languages: ['React / JS (60%)', 'TypeScript (25%)', 'Node.js (15%)']
      });
      setLoadingGit(false);
    }, 1500);
  };

  const handleSyncLinkedin = (e) => {
    e.preventDefault();
    if (!linkedinUser.trim() || loadingLink) return;
    setLoadingLink(true);
    setTimeout(() => {
      setLinkedinData({
        completeness: '92% (All-Star profile status)',
        headlineSuggest: 'Full Stack Engineer | React & Node.js Specialist | Builder of AI integrations',
        suggestions: [
          'Add detailed project summaries for your latest portfolio application under your experience section.',
          'Request recommendations from previous managers or senior developers focusing on engineering practices.',
          'Optimize your summary section using MERN keywords and your custom ATS target skills.'
        ]
      });
      setLoadingLink(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Profiles</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            GitHub & LinkedIn Intelligence Hub
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* GitHub Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-900 pb-4">
            <GitBranch size={20} />
            <h3>GitHub Analyzer</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Link your GitHub account to extract and compile commit patterns, PR counts, coding styles, and documentation ratings.
          </p>

          <form onSubmit={handleSyncGithub} className="flex gap-2">
            <input
              type="text"
              required
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              placeholder="e.g. github_developer"
              className="flex-1 px-3 py-2 bg-[#0a0e17] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-lg text-xs text-white placeholder-slate-700 transition"
            />
            <button
              type="submit"
              disabled={loadingGit}
              className="px-4 py-2 bg-brandPrimary hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1 glow-indigo disabled:opacity-40"
            >
              {loadingGit ? <RefreshCw size={12} className="animate-spin" /> : 'Connect'}
            </button>
          </form>

          {githubData && (
            <div className="space-y-4 pt-4 border-t border-slate-900 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-555 uppercase">Commits (Year)</span>
                  <p className="text-slate-200 font-bold mt-0.5">{githubData.commitsCount}</p>
                </div>
                <div className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-555 uppercase">PRs Merged</span>
                  <p className="text-slate-200 font-bold mt-0.5">{githubData.pullRequests}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Code Quality Rating</span>
                  <span className="text-emerald-400 font-bold">{githubData.codeQualityScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Documentation Quality</span>
                  <span className="text-slate-200 font-semibold">{githubData.docQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consistency Spectrum</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[200px]">{githubData.consistency}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LinkedIn Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-900 pb-4">
            <Linkedin size={20} />
            <h3>LinkedIn Audit</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Link your LinkedIn profile to audit description alignment, headline structure, and receive suggestions for improvements.
          </p>

          <form onSubmit={handleSyncLinkedin} className="flex gap-2">
            <input
              type="text"
              required
              value={linkedinUser}
              onChange={(e) => setLinkedinUser(e.target.value)}
              placeholder="e.g. linkedin_profile"
              className="flex-1 px-3 py-2 bg-[#0a0e17] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-lg text-xs text-white placeholder-slate-700 transition"
            />
            <button
              type="submit"
              disabled={loadingLink}
              className="px-4 py-2 bg-brandPrimary hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1 glow-indigo disabled:opacity-40"
            >
              {loadingLink ? <RefreshCw size={12} className="animate-spin" /> : 'Connect'}
            </button>
          </form>

          {linkedinData && (
            <div className="space-y-4 pt-4 border-t border-slate-900 text-xs">
              <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
                <span className="text-[10px] text-indigo-300 font-bold uppercase">Suggested Headline</span>
                <p className="text-slate-200 font-semibold mt-1 leading-relaxed">{linkedinData.headlineSuggest}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Optimization Tasks</span>
                {linkedinData.suggestions.map((s, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs text-slate-400">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;
