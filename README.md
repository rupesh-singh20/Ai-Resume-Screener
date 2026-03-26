# AI Resume Screener

An intelligent recruitment tool that analyzes and ranks multiple resumes against a specific job description using both keyword-based (ATS) and AI-powered scoring to identify the best candidates.

## Features

- **Batch Resume Upload**: Process multiple PDF/DOCX files simultaneously
- **Dual Scoring System**:
  - **ATS Score**: Keyword matching for skills (Python, JavaScript, Java, SQL, AWS) and experience detection
  - **AI Score**: Google Gemini-based contextual evaluation of job fit
  - **Final Score**: Weighted combination (70% AI + 30% ATS)
- **Top 5 Candidates Dashboard**: Visual cards showing top matches with contact info and fit reasoning
- **Full Results List**: All candidates sorted by score
- **Resume Viewer**: Modal popup to view complete parsed resume text
- **Live Candidate Info**: Extracted name, email, phone from resumes

## Technologies Used

### Backend (Flask/Python)

- Flask 2.3.3 - Web framework
- Flask-CORS - Cross-origin request handling
- google-generativeai - Gemini AI for resume evaluation
- pypdf - PDF extraction
- python-docx - DOCX parsing
- python-multipart - File upload handling

### Frontend (JavaScript/HTML/CSS)

- Vanilla JavaScript - Event handling & API communication
- Responsive CSS with gradient design
- Modal interface for resume viewing

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rupesh-singh20/Ai-Resume-Screener.git
   cd Ai-Resume-Screener
   ```

2. **Set up Python environment**:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # or
   source .venv/bin/activate  # On macOS/Linux
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

## Configuration

### Set Gemini API Key

Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

**Option 1: Environment Variable (Recommended)**

```bash
export GEMINI_API_KEY=your_api_key_here
```

**Option 2: Direct in Code**
Edit `Backend/app.py` line 32 and replace with your key (not recommended for production).

## Usage

1. **Run Backend Server**:

   ```bash
   cd Backend
   python app.py
   ```

   - Server starts on `http://localhost:5000`
   - Serves the frontend from `../Frontend/`

2. **Access the Application**:
   - Open `http://localhost:5000` in your browser
   - Paste the job description in the textarea
   - Upload resume files (PDF or DOCX format)
   - Click "Screen Resumes" to analyze

3. **View Results**:
   - Top 5 candidates displayed as cards
   - Click "View All Results" for full list
   - Click on any candidate card to view their full resume

## Project Structure

```
AI Resume Screener/
├── Backend/
│   ├── app.py                 # Main Flask application
│   ├── utils/
│   │   └── resume_parser.py   # Resume parsing logic
│   ├── requirements.txt       # Python dependencies
│   └── uploads/               # Temporary upload directory
├── Frontend/
│   ├── index.html             # Main HTML page
│   ├── script.js              # Frontend JavaScript
│   └── style.css              # CSS styling
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## API Endpoints

- `GET /` - Serves the frontend
- `POST /upload_resumes` - Upload and analyze resumes
  - Form data: `resumes` (files), `job_description` (text)
  - Returns: JSON with scored candidates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for resume evaluation
- Flask framework for the backend
- Open source libraries for PDF and DOCX processing
