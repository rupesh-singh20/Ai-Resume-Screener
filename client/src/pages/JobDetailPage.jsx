import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, MapPin, DollarSign, Calendar, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, Bookmark, ArrowLeft, ShieldCheck, Zap
} from 'lucide-react';
import JobReadinessAnalyzerModal from '../components/JobReadinessAnalyzerModal';
import ApplicationModal from '../components/ApplicationModal';

const JobDetailPage = () => {
  const { id } = useParams();
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const job = {
    id: id || 'job_1',
    title: 'Senior Full Stack Developer (MERN)',
    company: 'TechCorp Solutions',
    location: 'Remote (US/Canada)',
    workMode: 'Remote',
    experience: '4-6 years',
    salary: '$130,000 - $160,000 / year',
    deadline: 'August 15, 2026',
    matchScore: 84,
    description: 'TechCorp Solutions is seeking an experienced Senior Full Stack Developer to build high-throughput, resilient cloud applications using modern React, Node.js, Express, and MongoDB architectures.',
    responsibilities: [
      'Architect and deliver end-to-end features across frontend (React 18) and microservice backend (Node.js/Express).',
      'Optimize database queries in MongoDB and implement Redis caching for high traffic REST & GraphQL endpoints.',
      'Collaborate with product designers and DevOps engineers to implement CI/CD container deployment pipelines using Docker.',
      'Write clean, unit-tested code with Jest/React Testing Library and participate in peer code reviews.'
    ],
    requirements: [
      '4+ years of professional experience with Node.js, React, and MongoDB in production.',
      'Strong knowledge of asynchronous JavaScript, Event Loop, Promises, and ES6+ standards.',
      'Demonstrated expertise in RESTful API design and API security best practices.',
      'Solid experience with Git, GitHub Actions, and containerization fundamentals.'
    ],
    preferredSkills: [
      'Docker & Kubernetes container deployment experience.',
      'TypeScript migration experience in large React applications.',
      'AWS ECS / S3 infrastructure setup.'
    ],
    benefits: [
      '100% Remote flexibility',
      '$3,000 home office setup stipend',
      'Full health, dental & vision coverage',
      'Unlimited PTO & learning stipend'
    ],
    improvements: [
      { skill: 'Docker', priority: 'High Priority', impact: '+8% match increase', advice: 'Complete 1-hour containerization project in Skill Roadmap' },
      { skill: 'AWS ECS', priority: 'Medium Priority', impact: '+4% match increase', advice: 'Review AWS ECS deployment questions in Interview Prep' },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Back Link */}
      <div className="flex items-center justify-between">
        <Link to="/browse-jobs" className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Job Discovery
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSaved(!saved)}
            className={`btn-outline btn-xs flex items-center gap-1 ${saved ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : ''}`}
          >
            <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
            <span>{saved ? 'Saved' : 'Save Job'}</span>
          </button>
          <button onClick={() => setShowApplyModal(true)} className="btn-primary btn-xs">
            Apply Now
          </button>
        </div>
      </div>

      {/* Main Job Banner */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 rounded">
            Verified Partner Role
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            {job.title}
          </h1>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{job.company}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location} ({job.workMode})</span>
            <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.experience}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Deadline: {job.deadline}</span>
          </div>
        </div>

        {/* AI Match Card Widget */}
        <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg text-center shrink-0 min-w-[200px]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Your AI Compatibility</div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{job.matchScore}%</div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">High Profile Alignment</p>
          <button 
            onClick={() => setShowAnalyzer(true)}
            className="mt-3 w-full btn-outline btn-xs text-[11px] flex items-center justify-center gap-1"
          >
            <Sparkles size={12} /> Detailed Analysis
          </button>
        </div>
      </div>

      {/* AI Compatibility & Improve Before Applying Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Structured Job Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Job Overview */}
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Job Overview</h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Core Responsibilities</h2>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              {job.responsibilities.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements & Preferred Skills */}
          <div className="ui-card space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Requirements & Skills</h2>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              {job.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">Preferred Qualifications:</h3>
              <div className="space-y-1.5 text-xs text-gray-500">
                {job.preferredSkills.map((pref, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span>{pref}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Compatibility Breakdown & Improve Before Applying */}
        <div className="space-y-6">
          {/* Improve Before Applying Checklist */}
          <div className="ui-card space-y-3 border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Zap size={16} />
              <span>Improve Before Applying</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Addressing these 2 items can boost your match score from 84% to 96%.
            </p>

            <div className="space-y-2">
              {job.improvements.map((imp) => (
                <div key={imp.skill} className="p-2.5 bg-white dark:bg-gray-900 rounded border border-amber-200 dark:border-amber-800/80 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-900 dark:text-gray-100">{imp.skill}</span>
                    <span className="text-[10px] text-amber-600 font-semibold">{imp.priority}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{imp.impact}</div>
                  <p className="text-[10px] text-gray-500 mt-1">{imp.advice}</p>
                </div>
              ))}
            </div>

            <Link to="/roadmap" className="btn-outline btn-xs w-full text-center block">
              Open Skill Roadmap
            </Link>
          </div>

          {/* Quick Action Buttons */}
          <div className="ui-card space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Ready to Proceed?</h3>
            <button 
              onClick={() => setShowApplyModal(true)} 
              className="btn-primary w-full text-xs py-2.5"
            >
              Apply Now ({job.matchScore}% Match)
            </button>
            <Link 
              to="/roadmap" 
              className="btn-secondary w-full text-xs py-2 text-center block"
            >
              Improve Profile First
            </Link>
          </div>
        </div>
      </div>

      {/* Analyzer Modal */}
      {showAnalyzer && (
        <JobReadinessAnalyzerModal
          job={job}
          onClose={() => setShowAnalyzer(false)}
          onApply={() => {
            setShowAnalyzer(false);
            setShowApplyModal(true);
          }}
        />
      )}

      {/* Application Wizard Modal */}
      {showApplyModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
