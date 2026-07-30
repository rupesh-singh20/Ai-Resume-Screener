import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Map, Target, CheckCircle2, ArrowRight, Sparkles, 
  BookOpen, Code2, Layers, ShieldCheck, Clock
} from 'lucide-react';

const CareerRoadmapPage = () => {
  const roadmapSkills = [
    {
      id: 'docker',
      name: 'Docker & Containerization',
      priority: 'High Priority',
      reason: 'Required by 6 saved/applied jobs (TechCorp, CloudScale, DevOps Lead, etc.)',
      status: 'In Progress',
      progress: 60,
      impact: '+8% match increase across active applications',
      topics: ['Containers & Images', 'Dockerfile Best Practices', 'Docker Compose Multi-Container', 'Network Isolation'],
      project: 'Containerize a MERN Application (Frontend, Node API, MongoDB & Redis container orchestrator)'
    },
    {
      id: 'aws',
      name: 'AWS Cloud Services (ECS & S3)',
      priority: 'Medium Priority',
      reason: 'Required by 4 target backend architecture roles',
      status: 'Not Started',
      progress: 0,
      impact: '+5% match increase',
      topics: ['Amazon S3 File Uploads', 'AWS ECS Task Definitions', 'IAM Roles & Security Policies'],
      project: 'Deploy MERN Microservices on AWS ECS Fargate with Automated S3 Storage'
    },
    {
      id: 'redis',
      name: 'Redis In-Memory Caching',
      priority: 'Medium Priority',
      reason: 'Required by CloudScale & Apex Intelligence roles',
      status: 'Completed',
      progress: 100,
      impact: '+4% match achieved',
      topics: ['Cache Invalidation Strategies', 'Redis Pub/Sub', 'Session Store Integration'],
      project: 'Implement Redis Caching Layer for High Throughput Node.js API Endpoints'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4 border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Map size={16} />
            <span>Personalized Skill Gap Roadmap</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            Target Skill Path for Senior MERN Developer
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Dynamically constructed from skill requirements extracted from your saved and applied positions.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400 block font-medium">Overall Skill Readiness</span>
          <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">75% Complete</span>
        </div>
      </div>

      {/* Roadmap Skill Cards */}
      <div className="space-y-6">
        {roadmapSkills.map((skill) => (
          <div key={skill.id} className="ui-card space-y-4">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{skill.name}</h2>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    skill.priority === 'High Priority' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {skill.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  <strong>Reason:</strong> {skill.reason}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{skill.impact}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{skill.progress}%</span>
              </div>
            </div>

            {/* Topics & Hands-on Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-indigo-600" /> Core Learning Topics
                </h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {skill.topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <Code2 size={14} className="text-emerald-600" /> Hands-on Recommended Project
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {skill.project}
                </p>
                <Link to="/coding-sandbox" className="btn-primary btn-xs inline-flex items-center gap-1">
                  <span>Start Project Sandbox</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
