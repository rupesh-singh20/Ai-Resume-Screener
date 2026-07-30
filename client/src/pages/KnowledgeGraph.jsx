import React, { useRef, useEffect, useState } from 'react';
import { Network, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NODES_DATA = [
  { id: 'user', label: 'Candidate (You)', type: 'user', x: 250, y: 180, r: 24, color: '#6366f1' },
  { id: 'react', label: 'React.js', type: 'skill', x: 120, y: 90, r: 16, color: '#38bdf8' },
  { id: 'node', label: 'Node.js', type: 'skill', x: 380, y: 90, r: 16, color: '#10b981' },
  { id: 'docker', label: 'Docker Container', type: 'skill', x: 400, y: 260, r: 16, color: '#0ea5e9' },
  { id: 'stripe', label: 'Stripe Project', type: 'project', x: 130, y: 280, r: 18, color: '#ec4899' },
  { id: 'cert', label: 'AWS Certificate', type: 'cert', x: 250, y: 50, r: 16, color: '#f59e0b' },
  { id: 'recruiter', label: 'Recruiter Match', type: 'recruiter', x: 250, y: 310, r: 18, color: '#8b5cf6' }
];

const EDGES_DATA = [
  { from: 'user', to: 'react' },
  { from: 'user', to: 'node' },
  { from: 'user', to: 'docker' },
  { from: 'user', to: 'stripe' },
  { from: 'user', to: 'cert' },
  { from: 'stripe', to: 'react' },
  { from: 'docker', to: 'node' },
  { from: 'recruiter', to: 'user' }
];

const KnowledgeGraph = () => {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(NODES_DATA[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 500 * dpr;
    canvas.height = 360 * dpr;
    canvas.style.width = '500px';
    canvas.style.height = '360px';
    ctx.scale(dpr, dpr);

    const draw = () => {
      ctx.clearRect(0, 0, 500, 360);

      // Draw Edges
      ctx.lineWidth = 1.5;
      EDGES_DATA.forEach(edge => {
        const fromNode = NODES_DATA.find(n => n.id === edge.from);
        const toNode = NODES_DATA.find(n => n.id === edge.to);
        if (fromNode && toNode) {
          ctx.strokeStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
        }
      });

      // Draw Nodes
      NODES_DATA.forEach(node => {
        const isSelected = selectedNode && selectedNode.id === node.id;

        // Draw shadow glow for selected node
        if (isSelected) {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 15;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        // Draw node border ring if selected
        if (isSelected) {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Labels
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.r + 14);
      });
    };

    draw();
  }, [selectedNode]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Detect click hit over node coordinates
    const clicked = NODES_DATA.find(node => {
      const dist = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
      return dist <= node.r;
    });

    if (clicked) {
      setSelectedNode(clicked);
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
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Visualizations</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Network size={22} className="text-brandPrimary" /> Skill & Profile Knowledge Graph
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Interactive Canvas Graph */}
        <div className="md:col-span-2 glass-panel p-4 rounded-2xl border border-slate-800 flex justify-center items-center overflow-hidden bg-slate-950/20">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-pointer max-w-full"
          />
        </div>

        {/* Selected Node Details sidecard */}
        <div className="md:col-span-1 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5">
              <Info size={14} className="text-indigo-400" /> Selected Entity Details
            </h3>
            {selectedNode ? (
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Label</span>
                  <p className="text-sm font-extrabold text-slate-100 mt-0.5">{selectedNode.label}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Category</span>
                  <p className="text-slate-300 font-semibold capitalize">{selectedNode.type}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Estimated Weight</span>
                  <p className="text-emerald-400 font-bold mt-0.5">High Match Confidence (90%+)</p>
                </div>
                <div className="pt-2 text-slate-450 leading-snug">
                  {selectedNode.type === 'user' && 'Your core candidate profile. Nodes connecting directly represent your analyzed capabilities and integrations.'}
                  {selectedNode.type === 'skill' && 'Technical skill extracted from your profile. Strong connection indicates frequent usage in associated coding sandboxes.'}
                  {selectedNode.type === 'project' && 'Seeded portfolio application. Injects technical skills dynamically into ATS filters.'}
                  {selectedNode.type === 'cert' && 'AWS Developer Certificate. Extends credentials and raises recommended base salary estimations.'}
                  {selectedNode.type === 'recruiter' && 'Active connection mapping recruiter job descriptions directly matching your skill nodes.'}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">Click any interactive node on the graph to inspect relationship parameters.</p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 text-[10px] text-slate-500 leading-relaxed flex gap-2">
            <HelpCircle size={16} className="shrink-0 mt-0.5" />
            <span>Interactive graph visually displays relationships between candidates, projects, skills, certificates, and potential recruiters.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
