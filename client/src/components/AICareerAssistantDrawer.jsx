import React, { useState } from 'react';
import { 
  Sparkles, X, Send, Bot, User, ArrowRight, Brain, 
  HelpCircle, CheckCircle2, ChevronRight
} from 'lucide-react';

const AICareerAssistantDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your AIHireX Career Copilot. I have full context on your resume, active job applications, ATS score, and mock interview performances. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "What should I prepare for my TechCorp MERN interview?",
    "Why is my match 88% for Backend Node.js Architect?",
    "What high-impact skill should I learn next?",
    "Which job applications need immediate attention?"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = "Based on your active applications and profile context:";
      if (query.includes('TechCorp') || query.includes('MERN')) {
        reply = "For your Senior Full Stack Developer interview at TechCorp:\n\n1. Technical Focus: Prepare for deep Node.js event loop questions, MongoDB indexing strategies, and React 18 concurrent features.\n2. Gap to address: Be ready to explain how you handle containerized deployments (Docker/Kubernetes).\n3. Action item: Complete a 15-minute Mock Technical Interview in the Prep Hub.";
      } else if (query.includes('match') || query.includes('Backend')) {
        reply = "Your match for CloudScale's Backend Role is 88% because:\n- Matched: Node.js (High), Express, REST APIs, MongoDB.\n- Missing: Docker (Required for CI/CD pipelines).\n- Impact Simulator: Adding Docker hands-on experience will raise your estimated compatibility to 96%.";
      } else if (query.includes('learn')) {
        reply = "Top Priority Skill: Docker & Container Orchestration.\n\nReasoning: Docker is explicitly listed as a required/preferred skill across 6 of your saved/applied jobs. Completing the MERN containerization project in your Skill Roadmap will provide the greatest ROI.";
      } else {
        reply = "Your TechCorp application is currently in Technical Round stage and requires completing a Node.js mock assessment by Friday. InnoTech Labs also sent a coding sandbox test due July 31st.";
      }

      setMessages([...newMsgs, { sender: 'ai', text: reply }]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col justify-between animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-850">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-600 text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Career Assistant</h3>
              <p className="text-[11px] text-gray-500">Context-Aware Guidance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              )}
              <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                m.sender === 'user' 
                  ? 'bg-indigo-600 text-white font-medium rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 rounded-bl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2 items-center text-xs text-gray-400">
              <Bot size={14} className="animate-spin text-indigo-500" />
              <span>Analyzing job descriptions & candidate profile...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suggested Questions</div>
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-left text-xs px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-gray-700 dark:text-gray-300 hover:border-indigo-400 transition-colors truncate flex items-center justify-between group"
              >
                <span className="truncate">{qp}</span>
                <ChevronRight size={12} className="text-gray-400 group-hover:text-indigo-500 shrink-0" />
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Ask anything about your career..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="ui-input text-xs"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shrink-0 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistantDrawer;
