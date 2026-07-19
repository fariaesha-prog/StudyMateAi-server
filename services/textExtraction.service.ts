import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { AppError } from '../utils/appError';

export class TextExtractionService {
  public static async extract(buffer: Buffer, mimeType: string): Promise<string> {
    let text = '';

    if (mimeType === 'application/pdf') {
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        text = result.text;
      } finally {
        await parser.destroy();
      }
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (mimeType === 'text/plain') {
      text = buffer.toString('utf-8');
    } else {
      throw new AppError('Unsupported file type for text extraction', 400);
    }

    const cleaned = text.trim();
    if (!cleaned) {
      throw new AppError('No readable text found in the uploaded file', 422);
    }

    return cleaned;
  }
}