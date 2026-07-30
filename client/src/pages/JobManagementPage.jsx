import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, ArrowLeft, Send, MapPin, DollarSign, ListPlus, Trash2 } from 'lucide-react';

const JobManagementPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/recruiter');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/jobs', {
        title,
        company,
        description,
        requirements,
        location,
        salary
      });
      
      // Reset
      setTitle('');
      setCompany('');
      setDescription('');
      setRequirements('');
      setLocation('');
      setSalary('');
      
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish job opening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/recruiter-dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-brandAccent font-bold uppercase tracking-wider">Workspace</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create & Manage Job Openings</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 h-fit bg-gradient-brand">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-6 flex items-center gap-2">
            <ListPlus size={18} className="text-brandAccent" /> Job Specification Form
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Company name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                  placeholder="e.g. Acme Tech Solutions"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                  <MapPin size={12} /> Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                  placeholder="e.g. Remote, USA"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase flex items-center gap-1">
                  <DollarSign size={12} /> Salary Offer (Optional)
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                  placeholder="e.g. $120,000 - $140,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Required Skills (Comma-separated)</label>
              <input
                type="text"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-700 transition"
                placeholder="e.g. React, TypeScript, TailwindCSS, Jest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Job Description / Requirements</label>
              <textarea
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-lg focus:outline-none focus:border-brandPrimary text-xs text-white placeholder-slate-750 transition resize-none leading-relaxed"
                placeholder="Detail core tasks, expectations, and experience needed..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brandPrimary hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow hover:shadow-lg transition flex items-center justify-center gap-1.5 glow-indigo"
            >
              <Send size={14} />
              {loading ? 'Publishing...' : 'Publish Job Posting'}
            </button>
          </form>
        </div>

        {/* Existing posts */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-slate-850 h-fit max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Published Listings</h3>
          {jobs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No published openings found.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="p-4 rounded-xl bg-slate-900/30 border border-slate-850 flex flex-col justify-between hover:border-slate-800 transition">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{job.title}</h4>
                    <p className="text-[10px] text-brandAccent font-bold uppercase tracking-wider mt-0.5">{job.company}</p>
                    <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                      <MapPin size={10} /> {job.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagementPage;
