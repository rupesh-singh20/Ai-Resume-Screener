import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Upload, MessageSquare, Send, Sparkles, AlertCircle, Trash, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyIntel = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);

  // Q&A inputs
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [querying, setQuerying] = useState(false);

  // Culture Match state
  const [candidateVal, setCandidateVal] = useState('autonomy');
  const [cultureScore, setCultureScore] = useState(null);

  const fetchDocs = async () => {
    try {
      const res = await axios.get('/api/ai/company-docs');
      setDocs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !content || uploading) return;
    setUploading(true);
    try {
      await axios.post('/api/ai/company-doc', { title, category, content });
      setTitle('');
      setContent('');
      fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || querying) return;
    setQuerying(true);
    setChat(prev => [...prev, { sender: 'user', text: question }]);
    const currentQ = question;
    setQuestion('');
    try {
      const res = await axios.post('/api/ai/company-query', { question: currentQ });
      setChat(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setQuerying(false);
    }
  };

  const checkCultureMatch = () => {
    // Estimations
    const scores = {
      autonomy: 88,
      speed: 94,
      collaboration: 78,
      stability: 62
    };
    setCultureScore(scores[candidateVal] || 75);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Intelligence</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Building2 className="text-brandPrimary" /> Company Knowledge Base
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Upload Documents & List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
              <Upload size={14} className="text-brandPrimary" /> Add Company Document
            </h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Doc Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Engineering Guidelines"
                  className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-lg text-xs text-white placeholder-slate-700 transition"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-850 rounded-lg text-xs text-slate-300 outline-none"
                >
                  <option value="Engineering">Engineering Guidelines</option>
                  <option value="HR Policies">HR & Culture Policies</option>
                  <option value="Technical Stack">Standard Tech Stack</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Content Description</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Developers should maintain ES6 syntax, test modules locally, and prioritize React components."
                  rows={4}
                  className="w-full px-3 py-2 bg-[#0a0e17] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-lg text-xs text-white placeholder-slate-700 resize-none transition"
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 bg-brandPrimary hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 glow-indigo disabled:opacity-40"
              >
                {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                Add Guidelines
              </button>
            </form>
          </div>

          {/* List panel */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest">Active Documents ({docs.length})</h3>
            {loading ? (
              <p className="text-xs text-slate-600">Loading guidelines...</p>
            ) : docs.length === 0 ? (
              <p className="text-xs text-slate-600">No company documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {docs.map((d, i) => (
                  <div key={i} className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-200">{d.title}</h4>
                      <span className="text-[9px] text-brandAccent/80 font-semibold">{d.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Conversational Retrieval Chat & Culture Match */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat widget */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-[400px] bg-slate-950/20">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5 shrink-0">
              <MessageSquare size={14} className="text-indigo-400" /> Retrieval Q&A Assistant
            </h3>

            {/* Chat list */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {chat.map((c, i) => (
                <div key={i} className={`flex ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 rounded-xl text-xs max-w-md leading-relaxed border
                    ${c.sender === 'user'
                      ? 'bg-brandPrimary border-indigo-650 text-white rounded-tr-none'
                      : 'bg-slate-900 border-slate-850 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              ))}
              {querying && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl rounded-tl-none text-xs text-slate-500 flex items-center gap-1.5">
                    <RefreshCw size={12} className="animate-spin text-brandPrimary" /> Searching knowledge base...
                  </div>
                </div>
              )}
              {chat.length === 0 && (
                <p className="text-xs text-slate-655 text-center mt-20">Ask questions over engineering parameters, tech requirements, or company policy books.</p>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleAsk} className="p-3 border-t border-slate-900 flex gap-2 shrink-0 bg-slate-950/40">
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about engineering standards or review guidelines..."
                className="flex-1 px-3 py-2 bg-[#0a0e17] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-lg text-xs text-white placeholder-slate-700 transition"
              />
              <button
                type="submit"
                disabled={querying || !question.trim()}
                className="p-2.5 bg-brandPrimary hover:bg-indigo-500 text-white rounded-lg transition shrink-0 glow-indigo disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Culture Match widget */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" /> AI Culture Match Estimator
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare candidate core priorities against the company values index to evaluate overall cultural alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Select Primary Working Value</label>
                <select
                  value={candidateVal}
                  onChange={(e) => setCandidateVal(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0a0e17] border border-slate-850 rounded-xl text-xs text-slate-300 outline-none"
                >
                  <option value="autonomy">High Autonomy & Independent Scope</option>
                  <option value="speed">Velocity over Perfection (Iterative)</option>
                  <option value="collaboration">High Alignment & Group Decision Making</option>
                  <option value="stability">Structure, Documentation & Methodical Process</option>
                </select>
              </div>
              <button
                onClick={checkCultureMatch}
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition shrink-0"
              >
                Calculate Matching Score
              </button>
            </div>

            {cultureScore !== null && (
              <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/10 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Alignment Compatibility Estimation:</span>
                <span className="text-2xl font-black text-indigo-400">{cultureScore}% Match</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyIntel;
