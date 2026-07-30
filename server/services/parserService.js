const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF resume.');
  }
};

const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse Word Document resume.');
  }
};

const parseImage = async (buffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'eng'
    );
    return text || '';
  } catch (error) {
    console.error('Error in OCR recognition:', error);
    throw new Error('Failed to OCR scan the resume image.');
  }
};

const parseResume = async (file) => {
  const mimeType = file.mimetype;
  const buffer = file.buffer;

  if (mimeType === 'application/pdf') {
    return await parsePDF(buffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return await parseDOCX(buffer);
  } else if (mimeType.startsWith('image/')) {
    return await parseImage(buffer);
  } else {
    // Fallback to text string
    return buffer.toString('utf8');
  }
};

module.exports = {
  parseResume,
  parsePDF,
  parseDOCX,
  parseImage
};
