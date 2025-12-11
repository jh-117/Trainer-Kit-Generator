import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function parsePDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

async function parseDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function extractFileContent(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  try {
    let content = '';

    switch (fileExtension) {
      case 'pdf':
        content = await parsePDF(file);
        break;

      case 'docx':
      case 'doc':
        content = await parseDOCX(file);
        break;

      case 'txt':
        content = await parseTextFile(file);
        break;

      default:
        content = await parseTextFile(file);
        break;
    }

    if (!content || content.trim().length === 0) {
      throw new Error('No text content could be extracted from the file');
    }

    const maxContentLength = 50000;
    if (content.length > maxContentLength) {
      console.warn(`File content truncated from ${content.length} to ${maxContentLength} characters`);
      content = content.substring(0, maxContentLength) + '\n\n[Content truncated due to length...]';
    }

    return content;
  } catch (error) {
    console.error('Error extracting file content:', error);
    throw error;
  }
}
