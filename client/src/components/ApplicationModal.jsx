import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, FileText, Sparkles, ArrowRight, ArrowLeft, 
  X, AlertTriangle, ShieldCheck, UserCheck, Check
} from 'lucide-react';

const ApplicationModal = ({ job, onClose }) => {
  const [step, setStep] = useState(1); // 1: Resume, 2: Questions, 3: Verification, 4: AI Check, 5: Review
  const [selectedResume, setSelectedResume] = useState('Resume_Senior_MERN_2026.pdf');
  const [answers, setAnswers] = useState({
    experienceYears: '5 years',
    noticePeriod: '2 weeks',
    workAuthorization: 'Authorized to work in US/Canada'
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (!job) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      setSubmitted(true);
      setTimeout(() => {
        navigate('/applications/app_1');
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step {step} of 5</span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Applying for {job.title}
            </h2>
            <p className="text-xs text-gray-500">{job.company}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs">
          {['Resume', 'Questions', 'Verification', 'AI Check', 'Review'].map((label, idx) => {
            const currentStep = idx + 1;
            return (
              <div 
                key={label}
                className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors ${
                  step === currentStep 
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : step > currentStep 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-400'
                }`}
              >
                {currentStep}. {label}
              </div>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Application Submitted!</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Redirecting to your dedicated <strong>Application Workspace</strong> to begin interview preparation...
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">1. Select Target Resume</h3>
                  <div className="space-y-2">
                    {['Resume_Senior_MERN_2026.pdf', 'Resume_FullStack_General.pdf'].map(resName => (
                      <label key={resName} className={`p-3 rounded border flex items-center justify-between cursor-pointer transition-colors ${selectedResume === resName ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-gray-200 dark:border-gray-800'}`}>
                        <div className="flex items-center gap-3 text-xs">
                          <FileText size={16} className="text-indigo-600" />
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{resName}</span>
                            <span className="block text-[11px] text-gray-500">ATS Score: 88% Match</span>
                          </div>
                        </div>
                        <input type="radio" name="resume" checked={selectedResume === resName} onChange={() => setSelectedResume(resName)} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">2. Screening Questions</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Years of MERN Experience</label>
                      <input type="text" className="ui-input" value={answers.experienceYears} onChange={(e) => setAnswers({...answers, experienceYears: e.target.value})} />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Notice Period</label>
                      <input type="text" className="ui-input" value={answers.noticePeriod} onChange={(e) => setAnswers({...answers, noticePeriod: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">3. Profile Verification</h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <UserCheck size={16} /> Verified GitHub & LinkedIn Integrations
                    </div>
                    <p className="text-gray-500">Your profile link, top repositories, and verified skills are attached to this application package.</p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">4. AI Readiness Advisory Check</h3>
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
                      <Sparkles size={16} /> Readiness Score: {job.matchScore || 84}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      You are in full control. AIHireX never blocks your submission regardless of match score. We recommend completing the Docker prep module after submitting.
                    </p>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">5. Final Application Review</h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-800 space-y-1">
                    <p><strong>Position:</strong> {job.title}</p>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Selected Resume:</strong> {selectedResume}</p>
                    <p><strong>Work Authorization:</strong> {answers.workAuthorization}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!submitted && (
          <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
            <button onClick={handlePrev} disabled={step === 1} className="btn-secondary btn-sm flex items-center gap-1 disabled:opacity-30">
              <ArrowLeft size={14} /> Back
            </button>
            <button onClick={handleNext} className="btn-primary btn-sm flex items-center gap-1">
              <span>{step === 5 ? 'Submit Application' : 'Next Step'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
