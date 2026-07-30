import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Bookmark, ArrowUpRight, SlidersHorizontal, 
  MapPin, DollarSign, Briefcase, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import JobReadinessAnalyzerModal from '../components/JobReadinessAnalyzerModal';
import ApplicationModal from '../components/ApplicationModal';

const JobsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [minMatch, setMinMatch] = useState(70);
  
  const [selectedJobForAnalysis, setSelectedJobForAnalysis] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  // Comprehensive Dataset of high-density Jobs
  const jobsData = [
    {
      id: 'job_1',
      title: 'Senior Full Stack Developer (MERN)',
      company: 'TechCorp Solutions',
      location: 'Remote (US/Canada)',
      workMode: 'Remote',
      experience: '4-6 years',
      salary: '$130,000 - $160,000',
      matchScore: 92,
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
      postedDate: '2 days ago',
      roleType: 'Engineering',
      description: 'Building high-scale cloud native applications with MERN stack, microservices, and containerization.',
      matchedSkills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      missingSkills: ['Docker'],
    },
    {
      id: 'job_2',
      title: 'Backend Node.js & Distributed Systems Architect',
      company: 'CloudScale Inc.',
      location: 'San Francisco, CA',
      workMode: 'Hybrid',
      experience: '5+ years',
      salary: '$150,000 - $185,000',
      matchScore: 88,
      skills: ['Node.js', 'Express', 'Redis', 'AWS', 'PostgreSQL'],
      postedDate: '1 day ago',
      roleType: 'Engineering',
      description: 'Architecting high-throughput backend services and caching pipelines using Node.js and Redis.',
      matchedSkills: ['Node.js', 'Express', 'Redis'],
      missingSkills: ['AWS', 'PostgreSQL'],
    },
    {
      id: 'job_3',
      title: 'Frontend React Engineer & UI/UX Specialist',
      company: 'InnoTech Digital',
      location: 'New York, NY',
      workMode: 'On-site',
      experience: '3-5 years',
      salary: '$120,000 - $145,000',
      matchScore: 85,
      skills: ['React', 'Tailwind CSS', 'Redux Toolkit', 'Vite', 'Jest'],
      postedDate: '3 days ago',
      roleType: 'Frontend',
      description: 'Crafting responsive, accessible user interfaces for enterprise SaaS management tools.',
      matchedSkills: ['React', 'Tailwind CSS', 'Redux Toolkit'],
      missingSkills: ['Jest'],
    },
    {
      id: 'job_4',
      title: 'DevOps & Cloud Infrastructure Lead',
      company: 'Nexus Infrastructure',
      location: 'Austin, TX',
      workMode: 'Remote',
      experience: '6+ years',
      salary: '$160,000 - $200,000',
      matchScore: 76,
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
      postedDate: '4 days ago',
      roleType: 'DevOps',
      description: 'Leading cloud orchestration, automated deployment pipelines, and Kubernetes clusters.',
      matchedSkills: ['Docker', 'CI/CD'],
      missingSkills: ['Kubernetes', 'AWS', 'Terraform'],
    },
    {
      id: 'job_5',
      title: 'AI Platform Engineer (Node.js & Python)',
      company: 'Apex Intelligence',
      location: 'Seattle, WA',
      workMode: 'Remote',
      experience: '3-6 years',
      salary: '$140,000 - $175,000',
      matchScore: 90,
      skills: ['Node.js', 'Python', 'OpenAI API', 'MongoDB', 'FastAPI'],
      postedDate: 'Today',
      roleType: 'AI/ML',
      description: 'Integrating LLM models and vector storage into real-time analytical web applications.',
      matchedSkills: ['Node.js', 'OpenAI API', 'MongoDB'],
      missingSkills: ['Python', 'FastAPI'],
    }
  ];

  const filteredJobs = jobsData.filter(j => {
    const matchesQuery = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesWorkMode = selectedWorkMode === 'All' || j.workMode === selectedWorkMode;
    const matchesRole = selectedRole === 'All' || j.roleType === selectedRole;
    const matchesScore = j.matchScore >= minMatch;
    return matchesQuery && matchesWorkMode && matchesRole && matchesScore;
  });

  const toggleSave = (id) => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Job Discovery & AI Compatibility Engine
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Search roles scored directly against your resume parameters and technical skill vector.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-900 dark:text-gray-100">{filteredJobs.length}</span> verified positions
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="ui-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Main Search Input */}
          <div className="lg:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title, company, or skill (e.g. Node.js, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ui-input pl-9"
            />
          </div>

          {/* Work Mode Select */}
          <select 
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="ui-input"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Role Type Select */}
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="ui-input"
          >
            <option value="All">All Disciplines</option>
            <option value="Engineering">Software Engineering</option>
            <option value="Frontend">Frontend Development</option>
            <option value="DevOps">DevOps & Cloud</option>
            <option value="AI/ML">AI Infrastructure</option>
          </select>

          {/* AI Match threshold */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 text-xs">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-gray-500 shrink-0">Min Match: {minMatch}%</span>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* High Information-Density Jobs Table */}
      <div className="ui-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 text-gray-500 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Position & Company</th>
                <th className="py-3 px-4 font-semibold">Location & Mode</th>
                <th className="py-3 px-4 font-semibold">Compensation</th>
                <th className="py-3 px-4 font-semibold">Required Stack</th>
                <th className="py-3 px-4 font-semibold">AI Match</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-850/50 transition-colors">
                  {/* Position */}
                  <td className="py-3.5 px-4">
                    <Link to={`/jobs/${job.id}`} className="font-bold text-sm text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                      {job.title}
                    </Link>
                    <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                      {job.company} • Exp: {job.experience} • Posted {job.postedDate}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4">
                    <div className="text-gray-800 dark:text-gray-200 font-medium">{job.location}</div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                      {job.workMode}
                    </span>
                  </td>

                  {/* Compensation */}
                  <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    {job.salary}
                  </td>

                  {/* Required Stack */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {job.skills.map((skill) => {
                        const isMatched = job.matchedSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                              isMatched 
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' 
                                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* AI Match */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => setSelectedJobForAnalysis(job)}
                      className="group text-left"
                    >
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-extrabold ${
                          job.matchScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                          job.matchScore >= 80 ? 'text-indigo-600 dark:text-indigo-400' :
                          'text-amber-600'
                        }`}>
                          {job.matchScore}%
                        </span>
                        <Sparkles size={12} className="text-indigo-500 opacity-80 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[10px] text-gray-400 underline">Readiness Breakdown</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleSave(job.id)}
                        className={`p-1.5 rounded border transition-colors ${
                          savedJobs.includes(job.id)
                            ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-300 text-indigo-600'
                            : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600'
                        }`}
                        title="Save Job"
                      >
                        <Bookmark size={14} fill={savedJobs.includes(job.id) ? "currentColor" : "none"} />
                      </button>

                      <button
                        onClick={() => setSelectedJobForApply(job)}
                        className="btn-primary btn-xs"
                      >
                        Apply
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Readiness Analyzer Modal */}
      {selectedJobForAnalysis && (
        <JobReadinessAnalyzerModal
          job={selectedJobForAnalysis}
          onClose={() => setSelectedJobForAnalysis(null)}
          onApply={() => {
            const j = selectedJobForAnalysis;
            setSelectedJobForAnalysis(null);
            setSelectedJobForApply(j);
          }}
        />
      )}

      {/* Application Wizard Modal */}
      {selectedJobForApply && (
        <ApplicationModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  );
};

export default JobsListPage;
