import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw, 
  History, Eye, ShieldCheck, ArrowRight, GitCompare, Plus, Minus
} from 'lucide-react';

const ResumeAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('Analysis');
  const [selectedVersion, setSelectedVersion] = useState('v2');

  const resumeData = {
    score: 84,
    atsCompatibility: 'High (Passing 88% ATS parsers)',
    missingKeywords: ['Docker', 'AWS ECS', 'Kubernetes'],
    sections: [
      { name: 'Summary', status: 'Optimal', score: 90, feedback: 'Strong punchy summary highlighting MERN & microservices.' },
      { name: 'Work Experience', status: 'Optimal', score: 85, feedback: 'Quantified metrics present in 3 out of 4 roles.' },
      { name: 'Skills & Stack', status: 'Needs Refinement', score: 75, feedback: 'Add Docker containerization experience if verified.' },
      { name: 'Education', status: 'Optimal', score: 90, feedback: 'Degree & coursework clearly formatted.' }
    ],
    versions: [
      { id: 'v2', date: 'July 25, 2026', label: 'Resume_Senior_MERN_2026.pdf (Active)', score: 84 },
      { id: 'v1', date: 'June 10, 2026', label: 'Resume_FullStack_v1.pdf', score: 76 }
    ],
    versionDiff: {
      added: ['Added Redis session caching metrics to TechCorp role description', 'Added TypeScript 5.0 to technical skills list'],
      removed: ['Removed outdated jQuery and PHP experience details'],
      improved: ['Rephrased backend performance achievement to include benchmark numbers (+40% throughput)']
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4 border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <FileText size={16} />
            <span>Resume Intelligence & ATS Optimization</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            Resume_Senior_MERN_2026.pdf
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Parsed on July 25, 2026 • ATS Format: Standard Clean Single-Column PDF
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">ATS Score</span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{resumeData.score}%</span>
          </div>
          <button onClick={() => setActiveTab('Version History')} className="btn-secondary btn-sm flex items-center gap-1">
            <History size={14} />
            <span>Version History</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs font-medium gap-2">
        {['Analysis', 'Missing Keywords', 'Version History', 'Resume Preview'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Analysis' && (
        <div className="space-y-6">
          {/* Section Breakdown Grid */}
          <div className="ui-card space-y-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Section-by-Section ATS Evaluation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.sections.map(sec => (
                <div key={sec.name} className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-900 dark:text-gray-100">{sec.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{sec.score}% Score</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{sec.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Missing Keywords' && (
        <div className="ui-card space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Missing Keywords for Applied Roles
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Note: AIHireX only recommends highlighting skills you actually possess and have verified.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {resumeData.missingKeywords.map(kw => (
              <span key={kw} className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold rounded border border-amber-300 dark:border-amber-800">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Version History' && (
        <div className="ui-card space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Version Comparison & Diff Viewer
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 space-y-3 text-xs">
            <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <GitCompare size={16} className="text-indigo-600" />
              <span>Comparing Version 2 (Current) vs Version 1 (June 2026)</span>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <span className="font-semibold text-emerald-600 flex items-center gap-1"><Plus size={12} /> Added Enhancements:</span>
                {resumeData.versionDiff.added.map((item, i) => (
                  <p key={i} className="pl-4 text-gray-700 dark:text-gray-300">+ {item}</p>
                ))}
              </div>
              <div className="space-y-1 pt-1">
                <span className="font-semibold text-red-600 flex items-center gap-1"><Minus size={12} /> Removed Details:</span>
                {resumeData.versionDiff.removed.map((item, i) => (
                  <p key={i} className="pl-4 text-gray-700 dark:text-gray-300">- {item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Resume Preview' && (
        <div className="ui-card space-y-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Document Preview</h2>
          <div className="p-8 bg-gray-900 text-gray-200 rounded border border-gray-800 font-sans space-y-4 text-xs">
            <div className="border-b border-gray-700 pb-3">
              <h1 className="text-lg font-bold text-white">Alex Morgan</h1>
              <p className="text-indigo-400">Senior Full Stack MERN Developer | alex.m@example.com</p>
            </div>
            <div>
              <h3 className="font-bold text-white uppercase text-[11px]">Professional Summary</h3>
              <p className="text-gray-400 mt-1">Software Engineer with 5 years building scalable Node.js microservices and React frontends...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisPage;
