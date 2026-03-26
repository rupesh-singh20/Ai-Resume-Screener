# Triggering reload
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import json
from utils.resume_parser import parse_resume
import google.generativeai as genai
import tempfile
from datetime import datetime

app = Flask(__name__, static_folder='../Frontend', static_url_path='')
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

import traceback

@app.errorhandler(Exception)
def handle_error(e):
    print("BACKEND CRASH:", str(e))
    traceback.print_exc()
    response = jsonify({'error': f"Server error: {str(e)}"})
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response, 500

# Gemini API Key (use environment variable in production)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCt4aum9BaPxl5KzGhB-aNKQ3HlQ8ncINk")  # Replace with your actual Gemini API key

class ResumeScorer:
    def __init__(self):
        self.skills_keywords = {
            'python': ['python', 'django', 'flask', 'pandas', 'numpy'],
            'javascript': ['javascript', 'react', 'node.js', 'angular', 'vue'],
            'java': ['java', 'spring', 'hibernate'],
            'sql': ['sql', 'mysql', 'postgresql', 'oracle'],
            'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda']
        }
    
    def extract_features(self, text):
        """Extract features from resume text"""
        features = {}
        text_lower = text.lower()
        
        for skill, keywords in self.skills_keywords.items():
            features[skill] = sum(1 for keyword in keywords if keyword in text_lower)
        
        # Experience years estimation
        exp_keywords = ['year', 'years', 'yr', 'yrs']
        exp_score = 0
        for keyword in exp_keywords:
            if keyword in text_lower:
                exp_score += 1
        features['experience'] = min(exp_score * 2, 10)  # Max 10 years
        
        return features
    
    def score_resume(self, resume_text, job_description):
        """Score resume against job description using AI + features"""
        
        # Feature-based scoring (ATS-like)
        resume_features = self.extract_features(resume_text)
        ats_score = sum(resume_features.values()) * 5  # Normalize
        ats_score = min(ats_score, 100)
        
        # Check if Gemini API key is available
        if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
            # Fall back to feature-based scoring only
            return {
                'ats_score': ats_score,
                'ai_fit': 'UNKNOWN',
                'reason': 'AI scoring disabled - please set GEMINI_API_KEY in app.py',
                'final_score': ats_score,
                'features': resume_features
            }
        
        # AI-based fit assessment
        prompt = f"""
        Job Description: {job_description}
        
        Resume: {resume_text[:3000]}  # Limit context length
        
        Evaluate this resume for the job. Provide a JSON response with exactly:
        {{
            "ats_score": <number 0-100 based on keyword matches and relevance>,
            "fit": "YES" or "NO" if the candidate is a good fit,
            "reason": "brief explanation for the fit decision"
        }}
        
        Output only valid JSON without markdown wrapping:
        """
        
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-flash-latest")
            response = model.generate_content(prompt)
            
            content = response.text.strip()
            # Clean possible markdown JSON wrapping
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
                
            # Parse JSON
            data = json.loads(content)
            ai_ats_score = data.get('ats_score', ats_score)
            fit = data.get('fit', 'UNKNOWN')
            reason = data.get('reason', 'No reason provided')
            
            # Combine scores
            final_score = int(0.7 * ai_ats_score + 0.3 * ats_score)
            
            return {
                'ats_score': final_score,
                'ai_fit': fit,
                'reason': reason,
                'features': resume_features
            }
            
        except Exception as e:
            # Fall back to feature-based scoring if AI fails
            return {
                'ats_score': ats_score,
                'ai_fit': 'UNKNOWN',
                'reason': f'AI scoring failed: {str(e)}',
                'features': resume_features
            }

scorer = ResumeScorer()
UPLOAD_FOLDER = tempfile.gettempdir()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload_resumes', methods=['POST'])
def upload_resumes():
    if 'resumes' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('resumes')
    job_description = request.form.get('job_description', '')
    
    if not job_description:
        return jsonify({'error': 'Job description is required'}), 400
    
    results = []
    
    for file in files:
        if file.filename == '':
            continue
            
        # Save file
        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse resume
        resume_data = parse_resume(filepath)
        
        if resume_data:
            # Score resume
            scores = scorer.score_resume(resume_data['text'], job_description)
            scores['name'] = resume_data.get('name', 'Unknown')
            scores['email'] = resume_data.get('email', 'N/A')
            scores['phone'] = resume_data.get('phone', 'N/A')
            scores['filename'] = file.filename
            scores['resume_text'] = resume_data['text']
            
            results.append(scores)
        
        # Clean up file
        os.remove(filepath)
    
    # Sort by score
    results.sort(key=lambda x: x.get('final_score', x.get('ats_score', 0)), reverse=True)
    
    if not results:
        return jsonify({'error': 'No resumes could be processed. Please ensure files are valid PDF or DOCX format.'}), 400
    
    return jsonify({
        'results': results,
        'total': len(results),
        'best_candidates': results[:5]  # Top 5
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)