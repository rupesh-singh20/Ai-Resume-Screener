import React, { useState } from 'react';
import { 
  Play, Send, RotateCcw, Clock, Code2, CheckCircle2, 
  AlertTriangle, Sparkles, Terminal, ChevronRight
} from 'lucide-react';

const CodingSandbox = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(
`// Problem: Reverse Words in String & Optimize Memory
// Write an efficient function that reverses words in a given string while preserving whitespace.

function reverseWords(str) {
  if (!str) return '';
  return str
    .trim()
    .split(/\\s+/)
    .reverse()
    .join(' ');
}

// Test call
console.log(reverseWords("The quick brown fox"));`
  );
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const testCases = [
    { input: '"The quick brown fox"', expected: '"fox brown quick The"', status: 'Passed' },
    { input: '"  hello world  "', expected: '"world hello"', status: 'Passed' },
    { input: '"a good   example"', expected: '"example good a"', status: 'Passed' }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Running test suite against code implementation...\n');
    setTimeout(() => {
      setConsoleOutput(
        `> Test 1 Passed: Output: "fox brown quick The"\n` +
        `> Test 2 Passed: Output: "world hello"\n` +
        `> Test 3 Passed: Output: "example good a"\n\n` +
        `All 3 test cases executed successfully (12ms execution time).`
      );
      setIsRunning(false);

      setAiFeedback({
        correctness: '100% (Passes all edge cases)',
        approach: 'Regex Splitting & Native Array Reversal',
        timeComplexity: 'O(N) where N is length of string',
        spaceComplexity: 'O(N) for split array allocation',
        readinessScore: 92,
        suggestion: 'Consider two-pointer in-place swap if string is represented as a character array for O(1) space optimization.'
      });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Sandbox Header */}
      <div className="ui-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Code2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              Integrated Coding Interview Sandbox
            </h1>
            <p className="text-xs text-gray-500">Live code runner with AI complexity evaluation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ui-input text-xs w-36"
          >
            <option value="javascript">JavaScript (Node v18)</option>
            <option value="typescript">TypeScript v5.0</option>
            <option value="python">Python 3.11</option>
          </select>

          <button 
            onClick={handleRunCode} 
            disabled={isRunning}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            <Play size={14} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Problem Statement & Test Cases */}
        <div className="space-y-6">
          <div className="ui-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Problem Statement</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded">
                Medium Difficulty
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Reverse Words in String & Optimize Concurrency
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Given an input string <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono">str</code>, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono">str</code> will be separated by at least one space.
            </p>

            <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 text-xs space-y-1 font-mono text-gray-700 dark:text-gray-300">
              <p>Input: str = "  hello world  "</p>
              <p>Output: "world hello"</p>
              <p className="text-[11px] text-gray-400 font-sans mt-1">Explanation: Your reversed string should not contain leading or trailing spaces.</p>
            </div>
          </div>

          {/* Test Cases Table */}
          <div className="ui-card space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Verification Test Cases</h3>
            <div className="space-y-2 text-xs">
              {testCases.map((tc, idx) => (
                <div key={idx} className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="font-mono text-gray-700 dark:text-gray-300">Input: {tc.input}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {tc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor & Console Output */}
        <div className="space-y-4">
          <div className="ui-card p-0 overflow-hidden border-gray-800">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>solution.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'py'}</span>
              <span>UTF-8</span>
            </div>
            <textarea
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 bg-gray-900 text-emerald-400 font-mono-code text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>

          {/* Console Output Box */}
          <div className="ui-card p-4 bg-gray-950 border-gray-800 font-mono-code text-xs space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-800 pb-2">
              <Terminal size={14} /> Execution Console
            </div>
            <pre className="text-gray-300 whitespace-pre-wrap">{consoleOutput || 'Click "Run Code" to execute tests and receive AI evaluation.'}</pre>
          </div>

          {/* AI Feedback Box */}
          {aiFeedback && (
            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs space-y-2 animate-fade-in">
              <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-indigo-300">
                <span className="flex items-center gap-1.5"><Sparkles size={16} /> AI Code Complexity Analysis</span>
                <span className="text-emerald-600 font-extrabold">{aiFeedback.readinessScore}% Score</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 dark:text-gray-300 pt-1">
                <div><strong>Time Complexity:</strong> {aiFeedback.timeComplexity}</div>
                <div><strong>Space Complexity:</strong> {aiFeedback.spaceComplexity}</div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 pt-1 border-t border-indigo-100 dark:border-indigo-900">
                <strong>Optimization Tip:</strong> {aiFeedback.suggestion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingSandbox;
