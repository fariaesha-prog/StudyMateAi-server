import multer from 'multer';
import { AppError } from '../utils/appError';

const storage = multer.memoryStorage();

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'text/plain',
];

export const uploadDocument = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      return cb(new AppError('Unsupported file type. Allowed: PDF, DOCX, TXT.', 400) as any);
    }
    cb(null, true);
  },
});