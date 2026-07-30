import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, RefreshCw, BarChart2, ArrowLeft, Play, Square, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const VoiceInterview = () => {
  const [stage, setStage] = useState('intro'); // intro, speaking, review
  const [questionText, setQuestionText] = useState("Tell me about a challenging technical project you worked on and how you resolved engineering bottlenecks.");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let interval = null;
    if (recording) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const formatSecs = (val) => {
    const mins = Math.floor(val / 60);
    const secs = val % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartRecording = () => {
    setRecording(true);
    setSeconds(0);
    setTranscription('');
  };

  const handleStopRecording = () => {
    setRecording(false);
    setProcessing(true);
    setTimeout(() => {
      setTranscription("In my previous project, we encountered a severe memory leak in our database layer. By monitoring process telemetry, I identified an open connection pool leak. I refactored the connection wrappers using auto-closure syntax and implemented cache layers with Redis, which reduced average API latency by 45%.");
      setEvaluation({
        confidence: 'High (85%)',
        pace: 'Moderate (115 words per minute - Optimal)',
        fillerWords: '3 times ("um", "like")',
        clarity: 'Excellent (Clear pronunciation & structure)',
        feedback: 'The candidate answered contextually, detailing the diagnostic tools and quantified speed increments. The tone was professional and paced nicely.'
      });
      setProcessing(false);
      setStage('review');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Assessment Voice</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Mic size={22} className="text-brandPrimary" /> AI Voice Interview Simulator
          </h1>
        </div>
      </div>

      {stage === 'intro' && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center max-w-xl mx-auto space-y-6">
          <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center animate-pulse">
            <Mic size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Ready to Start Your Voice Simulation?</h2>
            <p className="text-xs text-slate-450 leading-relaxed mt-2 max-w-sm">
              The AI will read a question. You will answer using your microphone. Our evaluator checks clarity, speed, confidence index, and filler words.
            </p>
          </div>
          <button
            onClick={() => setStage('speaking')}
            className="px-6 py-3.5 bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow glow-indigo transition"
          >
            Launch Interview Simulator
          </button>
        </div>
      )}

      {stage === 'speaking' && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <span className="text-xs font-bold text-slate-500 uppercase">Interactive Session</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className={`h-2.5 w-2.5 rounded-full ${recording ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`} />
              <span>{recording ? `Recording: ${formatSecs(seconds)}` : 'Microphone Ready'}</span>
            </div>
          </div>

          {/* AI Question display */}
          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-850 flex items-start gap-4">
            <div className="h-9 w-9 rounded-xl bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <Volume2 size={16} />
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 font-bold uppercase">Question Prompt</span>
              <p className="text-sm font-bold text-slate-200 mt-1 leading-relaxed">{questionText}</p>
            </div>
          </div>

          {/* Visual waves mockup */}
          {recording && (
            <div className="h-12 flex items-center justify-center gap-1">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-brandPrimary rounded-full transition-all duration-300"
                  style={{ 
                    height: `${Math.floor(Math.random() * 40) + 8}px`,
                    animation: 'float 1s ease-in-out infinite',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4 border-t border-slate-900">
            {!recording ? (
              <button
                onClick={handleStartRecording}
                disabled={processing}
                className="flex items-center gap-2 px-6 py-3.5 bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow glow-indigo transition"
              >
                <Mic size={16} /> Start Microphone Response
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                <Square size={14} /> Stop Response & Analyze
              </button>
            )}
          </div>
        </div>
      )}

      {stage === 'review' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Transcript */}
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-900 pb-3">Response Transcription</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/40 p-4 rounded-xl border border-slate-850 italic">
              "{transcription}"
            </p>
            <button
              onClick={() => setStage('speaking')}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition"
            >
              <RefreshCw size={12} /> Retry Question Response
            </button>
          </div>

          {/* Metrics */}
          {evaluation && (
            <div className="md:col-span-1 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 h-fit">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5">
                <BarChart2 size={14} className="text-indigo-400" /> Voice Metrics
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Clarity</span>
                  <span className="text-slate-200 font-bold">{evaluation.clarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Confidence</span>
                  <span className="text-emerald-400 font-bold">{evaluation.confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Speech Pace</span>
                  <span className="text-slate-350 font-semibold">{evaluation.pace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Filler words</span>
                  <span className="text-pink-400 font-bold">{evaluation.fillerWords}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-900 text-xs text-slate-400 leading-relaxed bg-indigo-950/10 p-3 rounded-lg border border-indigo-900/30">
                <span className="text-[10px] text-indigo-300 font-bold uppercase block mb-1">AI Feedback Review</span>
                {evaluation.feedback}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceInterview;
