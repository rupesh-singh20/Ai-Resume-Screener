from pypdf import PdfReader
import re
from docx import Document
import os

class ResumeParser:
    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'(\+?1[-.\s]?)?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})'
        self.name_pattern = r'^[A-Z][a-z]+ [A-Z][a-z]+'
    
    def extract_text_pdf(self, filepath):
        text = ""
        with open(filepath, 'rb') as file:
            pdf_reader = PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    
    def extract_text_docx(self, filepath):
        doc = Document(filepath)
        text = []
        for para in doc.paragraphs:
            text.append(para.text)
        return '\n'.join(text)
    
    def parse_resume(self, filepath):
        """Parse resume and extract key information"""
        filename = os.path.basename(filepath).lower()
        
        try:
            if filename.endswith('.pdf'):
                text = self.extract_text_pdf(filepath)
            elif filename.endswith(('.docx', '.doc')):
                text = self.extract_text_docx(filepath)
            else:
                return None
            
            # Extract metadata
            email = re.search(self.email_pattern, text)
            phone = re.search(self.phone_pattern, text)
            
            # Extract name (first line usually contains name)
            lines = text.split('\n')
            name = lines[0].strip() if lines else "Unknown"
            
            return {
                'name': name,
                'email': email.group() if email else 'N/A',
                'phone': phone.group() if phone else 'N/A',
                'text': text
            }
            
        except Exception as e:
            print(f"Error parsing {filepath}: {str(e)}")
            return None

parser = ResumeParser()

def parse_resume(filepath):
    return parser.parse_resume(filepath)