import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, FileType, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const ResumeUploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setError('');
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
      setError('Invalid file type. Please upload a PDF, DOCX, or Image file (PNG, JPG).');
      setFile(null);
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      setFile(null);
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload first.');
      return;
    }

    setLoading(true);
    setProgress(15);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      setProgress(40);
      await axios.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProgress(100);
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload and parse resume. Please try again.');
      setLoading(false);
      setProgress(0);
    }
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-[calc(100vh-140px)] flex flex-col justify-center">
        <div className="w-full max-w-xl mx-auto glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-6 shadow-xl">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow shadow-emerald-500/5 animate-float-none">
            <CheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Resume Uploaded Successfully!</h2>
            <p className="text-slate-400 text-xs mt-2.5 leading-relaxed font-sans">
              Google Gemini has successfully parsed and scored your profile layout, details, and experience. You can now view your detailed ATS report.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate('/analysis')}
              className="px-6 py-3 rounded-xl bg-brandPrimary hover:bg-indigo-500 text-white font-bold text-xs shadow hover:shadow-lg transition flex items-center justify-center gap-1.5 glow-indigo"
            >
              Go to ATS Analysis
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-[calc(100vh-140px)] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Upload Your Resume</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Our Gemini AI engine will parse your profile, grade formatting and keyword matches, and detect career gaps.
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition select-none
            ${file ? 'border-brandPrimary bg-brandPrimary/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/10'}
          `}
          onClick={() => document.getElementById('resume-file-input').click()}
        >
          <input
            id="resume-file-input"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />

          <div className="h-16 w-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow animate-float">
            <Upload size={28} className={file ? 'text-brandPrimary' : ''} />
          </div>

          <p className="text-base font-bold text-slate-200 mb-1.5">
            {file ? file.name : 'Drag & Drop your resume here'}
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Supports PDF, DOCX, or Image (PNG, JPG) up to 5MB
          </p>
          
          <button
            type="button"
            className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            Browse Files
          </button>
        </div>

        {file && !loading && (
          <div className="mt-6 flex items-center justify-between p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <FileType size={20} className="text-indigo-400" />
              <div>
                <p className="text-xs font-bold text-slate-200">{file.name}</p>
                <p className="text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-slate-500 hover:text-red-400 font-semibold transition"
            >
              Clear
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-brandPrimary" />
                Gemini AI is parsing and scoring resume structure...
              </span>
              <span className="text-brandPrimary font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brandPrimary to-brandAccent h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-3.5 mt-8 rounded-xl bg-brandPrimary hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-brandPrimary text-white font-bold text-sm shadow hover:shadow-lg transition flex items-center justify-center gap-2 glow-indigo"
        >
          {loading ? 'Analyzing Profile Details...' : 'Analyze Resume Now'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
