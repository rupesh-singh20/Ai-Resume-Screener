import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, CheckCircle2, ChevronRight, X, Sparkles, BookOpen, 
  HelpCircle, AlertTriangle, Layers, Code2, UserCheck, Play
} from 'lucide-react';

const InterviewPrepHubPage = () => {
  const [activeCategory, setActiveCategory] = useState('Technical Questions');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const prepHeader = {
    company: 'TechCorp Solutions',
    role: 'Senior Full Stack Developer (MERN)',
    status: 'Technical Round Scheduled',
    interviewDate: 'August 7, 2026',
    progress: 75
  };

  const categories = [
    'Role-Specific Questions',
    'Resume-Based Questions',
    'Technical Questions',
    'HR Questions',
    'Behavioral Questions',
    'System Design Questions',
    'Coding Questions'
  ];

  const questionsDatabase = {
    'Technical Questions': [
      {
        id: 'q1',
        title: 'Node.js Event Loop Execution Order',
        question: 'Explain how macro-tasks (setImmediate, setTimeout) and micro-tasks (process.nextTick, Promises) are prioritized in the Node.js event loop.',
        difficulty: 'Hard',
        structure: '1. Define Event Loop phases (Timers, Pending, Poll, Check, Close).\n2. Contrast Microtasks vs Macrotasks.\n3. Detail execution priority of process.nextTick vs Promise.then.',
        concepts: ['Event Loop Phases', 'Microtask Queue', 'process.nextTick', 'Node libuv'],
        example: 'In Node.js, process.nextTick callbacks execute immediately after the current operation finishes, BEFORE any Promise microtasks or event loop phase transitions.',
        mistakes: ['Confusing browser Event Loop with Node.js libuv phase loop.', 'Assuming setTimeout(fn, 0) runs immediately before process.nextTick.'],
        followUps: ['How does worker_threads differ from cluster module in scaling CPU-heavy workloads?']
      },
      {
        id: 'q2',
        title: 'MongoDB Indexing & Query Execution',
        question: 'How do compound indexes work in MongoDB, and what is the "ESR" (Equal, Sort, Range) rule?',
        difficulty: 'Medium',
        structure: '1. Explain Compound Index structure.\n2. Define ESR rule: Equality fields first, Sort fields second, Range fields last.\n3. Demonstrate index scan vs collection scan using explain().',
        concepts: ['B-Tree Indexes', 'ESR Rule', 'Covered Queries', 'explain("executionStats")'],
        example: 'For query db.users.find({ status: "active", age: { $gte: 21 } }).sort({ lastName: 1 }), index should be { status: 1, lastName: 1, age: 1 }.',
        mistakes: ['Placing Range fields before Sort fields in index definition.'],
        followUps: ['When should you use a Partial Index instead of a Compound Index?']
      }
    ],
    'Role-Specific Questions': [
      {
        id: 'q3',
        title: 'React 18 Concurrent Rendering & Transitions',
        question: 'What problem does useTransition solve in React 18, and how does it prevent UI blocking during heavy state updates?',
        difficulty: 'Medium',
        structure: '1. Differentiate Urgent vs Non-urgent state updates.\n2. Explain useTransition hook syntax.\n3. Show how React yields rendering back to main thread.',
        concepts: ['Fiber Reconciler', 'Concurrent Mode', 'useTransition', 'isPending'],
        example: 'Wrap heavy search filtering inside startTransition(() => setFilteredResults(data)) so keystroke input remains 60fps responsive.',
        mistakes: ['Using useTransition for controlled form inputs instead of debouncing.'],
        followUps: ['What is the difference between useTransition and useDeferredValue?']
      }
    ],
    'System Design Questions': [
      {
        id: 'q4',
        title: 'Designing a Real-Time Job Application Pipeline',
        question: 'How would you architect a real-time notification engine for application status updates using MERN + WebSockets/Redis?',
        difficulty: 'Hard',
        structure: '1. Client connection layer (Socket.io).\n2. Pub/Sub broker (Redis Pub/Sub).\n3. Database persistence (MongoDB).\n4. Scalability strategy across multiple server instances.',
        concepts: ['WebSockets', 'Redis Pub/Sub', 'Horizontal Scaling', 'Event-Driven Architecture'],
        example: 'When recruiter updates status in MongoDB, server emits message to Redis channel. Worker node listens and pushes to target candidate socket.',
        mistakes: ['Relying on single in-memory WebSocket instance without Redis pub/sub adapter.'],
        followUps: ['How do you handle client reconnects without missing notification events?']
      }
    ]
  };

  const currentQuestions = questionsDatabase[activeCategory] || questionsDatabase['Technical Questions'];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Prep Hub Header */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4 border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Brain size={16} />
            <span>Interview Preparation Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            {prepHeader.role}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {prepHeader.company} • Status: <span className="font-semibold text-emerald-600">{prepHeader.status}</span> • Target: {prepHeader.interviewDate}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-gray-500 block font-medium">Prep Readiness</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{prepHeader.progress}%</span>
          </div>
          <Link to="/mock-interview" className="btn-primary btn-sm flex items-center gap-1">
            <Play size={14} />
            <span>Launch Mock Interview</span>
          </Link>
        </div>
      </div>

      {/* Main Prep Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Category Selector */}
        <div className="ui-card p-2 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Question Domains
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{cat}</span>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          ))}
        </div>

        {/* Right 3 Cols: Question List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {activeCategory} ({currentQuestions.length} Questions)
            </h2>
            <span className="text-xs text-gray-500">Focus on frameworks & conceptual understanding</span>
          </div>

          <div className="space-y-3">
            {currentQuestions.map((q) => (
              <div 
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className="ui-card p-4 hover:border-indigo-400 cursor-pointer transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    q.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                    View Framework & Solution →
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600">
                  {q.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{q.question}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {q.concepts.map(c => (
                    <span key={c} className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Drill-down Drawer / Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 h-full border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white rounded">
                  {selectedQuestion.difficulty} Difficulty
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {selectedQuestion.title}
                </h2>
              </div>
              <button onClick={() => setSelectedQuestion(null)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded">
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">Question Prompt</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-850 p-3 rounded border border-gray-200 dark:border-gray-800 font-medium">
                  {selectedQuestion.question}
                </p>
              </div>

              {/* Answer Structure Framework */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                  <BookOpen size={16} className="text-indigo-600" /> Suggested Answer Structure
                </h3>
                <pre className="p-3 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded font-sans text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {selectedQuestion.structure}
                </pre>
              </div>

              {/* Key Concepts */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Key Concepts to Touch Upon</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuestion.concepts.map(c => (
                    <span key={c} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Example Answer */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Example Explanation</h3>
                <p className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {selectedQuestion.example}
                </p>
              </div>

              {/* Common Mistakes */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm text-red-600 dark:text-red-400">Common Pitfalls & Mistakes</h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {selectedQuestion.mistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
              <button onClick={() => setSelectedQuestion(null)} className="btn-secondary btn-sm">Close</button>
              <Link to="/mock-interview" className="btn-primary btn-sm flex items-center gap-1">
                <span>Practice in AI Mock Environment</span>
                <Play size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrepHubPage;
