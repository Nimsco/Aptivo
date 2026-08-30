import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/:examId', upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('NO_FILE', 'No file uploaded');
    }

    const document = await prisma.document.create({
      data: {
        userId: req.user!.id,
        examId: req.params.examId,
        name: req.body.name || req.file.originalname,
        fileType: path.extname(req.file.originalname).slice(1),
        fileSize: req.file.size,
        filePath: req.file.path,
        status: 'processing'
      }
    });

    // Simulate document processing (in production, use a queue)
    setTimeout(async () => {
      await prisma.document.update({
        where: { id: document.id },
        data: { status: 'completed' }
      });
    }, 2000);

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
});

router.get('/:examId', async (req: AuthRequest, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { examId: req.params.examId, userId: req.user!.id }
    });
    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.id }
    });

    if (!doc) {
      throw new AppError('NOT_FOUND', 'Document not found');
    }

    // Delete file from disk
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
