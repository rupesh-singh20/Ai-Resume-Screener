import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Send, SkipForward, RotateCcw, Clock, 
  Brain, Bot, CheckCircle2, AlertTriangle, Sparkles, Volume2
} from 'lucide-react';
import MockInterviewResults from '../components/MockInterviewResults';

const MockInterviewPage = () => {
  const [round, setRound] = useState('Technical Round');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min per question timer
  const [interviewComplete, setInterviewComplete] = useState(false);

  const interviewQuestions = [
    {
      round: 'Technical Round',
      question: 'How do you handle asynchronous operations and error propagation in Node.js Express controllers?',
      difficulty: 'Medium',
      hint: 'Mention express-async-errors or central error handling middleware.'
    },
    {
      round: 'Project Round',
      question: 'Describe a production bottleneck you encountered in a MERN stack application and how you diagnosed and resolved it.',
      difficulty: 'Hard',
      hint: 'Use the STAR method (Situation, Task, Action, Result).'
    },
    {
      round: 'Behavioral Round',
      question: 'How do you handle technical disagreements with senior developers or architects during code reviews?',
      difficulty: 'Medium',
      hint: 'Focus on empirical benchmarks, code readability, and constructive dialogue.'
    },
    {
      round: 'HR Round',
      question: 'What are your career expectations for the next 2-3 years, and why TechCorp Solutions?',
      difficulty: 'Easy',
      hint: 'Align personal growth with TechCorp tech stack expansion.'
    }
  ];

  useEffect(() => {
    if (interviewComplete) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewComplete]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < interviewQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setRound(interviewQuestions[currentQuestionIdx + 1].round);
      setCandidateAnswer('');
      setTimeLeft(300);
    } else {
      setInterviewComplete(true);
    }
  };

  const currentQ = interviewQuestions[currentQuestionIdx];

  if (interviewComplete) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <MockInterviewResults onPracticeAgain={() => {
          setInterviewComplete(false);
          setCurrentQuestionIdx(0);
          setCandidateAnswer('');
          setTimeLeft(300);
        }} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Focused Interview Header Bar */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
            AI
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Target Position: Senior Full Stack Developer</span>
              <span>•</span>
              <span className="text-indigo-600 font-bold">{round}</span>
            </div>
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
              AI Mock Interview Environment
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded">
            <Clock size={14} className="text-indigo-600" />
            <span>Timer: {formatTime(timeLeft)}</span>
          </div>
          <div className="text-gray-500">
            Question {currentQuestionIdx + 1} of {interviewQuestions.length}
          </div>
        </div>
      </div>

      {/* Main Split Area: AI Interviewer & Response Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 1 Col: AI Interviewer Avatar & Context */}
        <div className="ui-card flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gray-50 dark:bg-gray-850">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              <Bot size={36} />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Senior Technical Interviewer</h2>
            <p className="text-[11px] text-gray-500">Evaluating conceptual depth & STAR answers</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
            Round: {round}
          </span>
        </div>

        {/* Right 2 Cols: Question & Candidate Response */}
        <div className="md:col-span-2 space-y-4">
          {/* Question Card */}
          <div className="ui-card space-y-2 border-indigo-200 dark:border-indigo-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Current Question</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug">
              {currentQ.question}
            </h3>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded text-xs text-gray-500 italic">
              Hint: {currentQ.hint}
            </div>
          </div>

          {/* Response Textarea & Speech Input */}
          <div className="ui-card space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span>Your Response:</span>
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  isRecording ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                }`}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              placeholder="Type your answer or speak using voice input..."
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              className="ui-input text-xs leading-relaxed"
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCandidateAnswer('')}
                  className="btn-outline btn-xs flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Clear
                </button>
                <button 
                  onClick={() => handleNextQuestion()}
                  className="btn-secondary btn-xs flex items-center gap-1"
                >
                  <SkipForward size={12} /> Skip
                </button>
              </div>

              <button 
                onClick={handleNextQuestion}
                className="btn-primary btn-sm flex items-center gap-1.5"
              >
                <span>Submit Answer</span>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
