import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Brain, Send, User, Sparkles, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerGPTCoach = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am CareerGPT, your personal AI Career Coach. I've analyzed your resume details, project profile, and interview records. Ask me anything—whether you want a custom roadmap, advice on which frameworks to learn next, or interview negotiation tips."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/coach', {
        message: messageText,
        history: messages
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an issue querying your profile context. Please try again shortly.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedClick = (text) => {
    handleSend(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 flex flex-col h-[calc(100vh-100px)] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">AI Coach</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Brain size={22} className="text-brandPrimary" /> CareerGPT Workspace
          </h1>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="flex-1 min-h-0 flex flex-col glass-panel rounded-2xl border border-slate-800 relative overflow-hidden bg-slate-950/20">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="h-9 w-9 rounded-xl bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <Brain size={16} />
                </div>
              )}
              <div className={`p-4 rounded-2xl text-xs max-w-xl leading-relaxed font-medium border
                ${m.role === 'user' 
                  ? 'bg-brandPrimary border-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="h-9 w-9 rounded-xl bg-pink-950/40 border border-pink-900/40 flex items-center justify-center text-pink-400 shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-4">
              <div className="h-9 w-9 rounded-xl bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Brain size={16} />
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-brandPrimary" /> CareerGPT is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Suggestion Pills */}
        {messages.length === 1 && (
          <div className="px-6 py-3 border-t border-slate-900 flex flex-wrap gap-2 shrink-0">
            {[
              'Should I learn Docker next?',
              'What roles match my personality traits?',
              'Explain how to target $140k+ salary hikes',
              'Draft an interview mock preparation list'
            ].map((suggest, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedClick(suggest)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-700 transition"
              >
                {suggest}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-900 shrink-0 bg-slate-950/40 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask CareerGPT a career path question..."
            className="flex-1 px-4 py-3 bg-[#0d1324] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-xl text-xs text-white placeholder-slate-600 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3 bg-brandPrimary hover:bg-indigo-500 text-white rounded-xl shadow transition shrink-0 disabled:opacity-40 glow-indigo"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerGPTCoach;
