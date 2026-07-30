import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, ArrowLeft, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

const CoverLetterPage = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return;

    setLoading(true);
    setError('');
    setCoverLetter('');

    try {
      const res = await axios.post('/api/resumes/cover-letter', { jobTitle, companyName });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate cover letter. Please verify your resume is uploaded.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">AI Assistant</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Cover Letter Generator</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Details */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-slate-850 h-fit">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Target Details</h3>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Job Position</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0e17] border border-slate-800 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0e17] border border-slate-800 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                placeholder="e.g. Google"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !jobTitle || !companyName}
              className="w-full py-3 rounded-xl bg-brandPrimary hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-brandPrimary text-white font-bold text-xs shadow hover:shadow-lg transition flex items-center justify-center gap-1.5 glow-indigo"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Write Letter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated output */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden min-h-[300px] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-800 bg-[#0d1527]/30 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-brandPrimary" /> Document Preview
              </span>
              {coverLetter && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold transition"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Content
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="p-6 flex-grow flex items-center justify-center">
              {loading ? (
                <div className="text-center space-y-3">
                  <div className="h-8 w-8 border-2 border-slate-850 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Gemini is structuring your qualifications against standard cover letter formulas...</p>
                </div>
              ) : coverLetter ? (
                <pre className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-text w-full">
                  {coverLetter}
                </pre>
              ) : (
                <div className="text-center text-slate-500 text-xs max-w-sm">
                  Fill out your target job title and company name on the left to generate a personalized cover letter matching your resume metrics.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
