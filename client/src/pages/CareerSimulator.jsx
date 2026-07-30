import React, { useState } from 'react';
import axios from 'axios';
import { Target, ArrowLeft, Send, Sparkles, RefreshCw, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerSimulator = () => {
  const [goal, setGoal] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!goal.trim() || loading) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/ai/simulate', { goal });
      setSteps(res.data.steps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Simulation</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Career Simulator</h1>
        </div>
      </div>

      {/* Goal Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-350 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400 animate-float" /> Project Your Future Target
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Type your ultimate career target (e.g. *"I want Google in 2 years"*, *"Stripe Tech Lead"*). Our simulator breaks down your active profile capabilities against real hiring specifications at those organizations.
        </p>

        <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. I want Google in 2 years"
            className="flex-1 px-4 py-3 bg-[#0d1324] border border-slate-850 focus:border-brandPrimary focus:outline-none rounded-xl text-xs text-white placeholder-slate-600 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brandPrimary hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5 transition shrink-0 glow-indigo disabled:opacity-40"
          >
            {loading ? <><RefreshCw size={14} className="animate-spin" /> Simulating...</> : <><Send size={14} /> Calculate Roadmap</>}
          </button>
        </form>
      </div>

      {/* Simulation Timeline */}
      {steps.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-sm font-bold text-slate-350 uppercase tracking-widest">
              Goal Roadmap: <span className="text-white normal-case font-extrabold">{goal}</span>
            </h3>
          </div>

          <div className="relative pl-8 border-l-2 border-slate-800 space-y-8 ml-4">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[45px] top-0.5 h-7 w-7 rounded-full border-4 border-[#0b0f19] bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-brandPrimary group-hover:border-indigo-900/60 transition-colors">
                  {i === steps.length - 1 ? <Target size={12} className="text-brandAccent" /> : <Circle size={10} />}
                </div>

                <div className="glass-card p-5 rounded-xl border border-slate-850 hover:border-slate-800 transition bg-slate-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                      Milestone {i + 1}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-200">{s.step}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.details}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> Roadmap calculation completes successfully. Ready to pursue target milestones.
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerSimulator;
