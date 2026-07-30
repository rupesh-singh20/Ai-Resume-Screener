import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, ArrowLeft, PlusCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SKILL_INCREMENTS = ['Docker', 'AWS', 'System Design', 'TypeScript', 'GraphQL', 'Kubernetes'];

const SalaryPredictor = () => {
  const [baseLpa, setBaseLpa] = useState(6);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [expectedLpa, setExpectedLpa] = useState(6);
  const [progression, setProgression] = useState([]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  useEffect(() => {
    const calculateSalary = async () => {
      try {
        const res = await axios.post('/api/ai/salary-predict', {
          baseLpa,
          skills: selectedSkills
        });
        setExpectedLpa(res.data.expectedLpa);
        setProgression(res.data.progression || []);
      } catch (err) {
        console.error(err);
      }
    };
    calculateSalary();
  }, [baseLpa, selectedSkills]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Estimations</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TrendingUp size={22} className="text-emerald-400" /> AI Salary Predictor
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sliders and Checkboxes */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Current Base Salary (₹ LPA)
              </label>
              <input
                type="range"
                min="3"
                max="40"
                step="1"
                value={baseLpa}
                onChange={(e) => setBaseLpa(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-bold mt-2">
                <span className="text-slate-600">₹3 LPA</span>
                <span className="text-emerald-400 text-sm">₹{baseLpa} LPA</span>
                <span className="text-slate-600">₹40 LPA</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Skills to Learn
              </label>
              <div className="space-y-2">
                {SKILL_INCREMENTS.map(skill => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition
                        ${isSelected 
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400' 
                          : 'bg-slate-900/30 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                        }`}
                    >
                      <span>{skill}</span>
                      <PlusCircle size={14} className={`transition ${isSelected ? 'rotate-45 text-emerald-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Estimation outputs */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between bg-[#0e1629]/30">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expected compensation</span>
              <p className="text-4xl font-extrabold text-white tracking-tight mt-1">₹{expectedLpa} LPA</p>
            </div>
            <div className="px-3.5 py-2.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={14} /> Estimated +{((expectedLpa - baseLpa) / baseLpa * 100).toFixed(0)}% Increment
            </div>
          </div>

          {/* Graph visualizer */}
          <div className="glass-card p-6 rounded-2xl border border-slate-850 h-[300px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Increment Projection Graph</h3>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progression}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="skill" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#34d399', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="lpa" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 text-[10px] text-slate-500 leading-relaxed flex gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>Expected salaries represent typical market values from active recruitment dashboards. Actual offers depend heavily on coding assessments, core behavioral alignment, and recruiter negotiation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPredictor;
