import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Upload endpoint
router.post('/', (req, res, next) => {
    upload.array('images', 10)(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ error: err.message });
        }
        // Everything went fine.
        next();
    });
}, (req: Request, res: Response) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return;
        }

        const files = req.files as Express.Multer.File[];
        const imageUrls = files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

        res.json({ images: imageUrls });
    } catch (error) {
        console.error('Upload processing error:', error);
        res.status(500).json({ error: 'Upload failed during processing' });
    }
});

export default router;
