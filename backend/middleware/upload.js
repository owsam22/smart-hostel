import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const UPLOAD_DIR = './uploads/issues';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
    cb(null, name);
  },
});

// Filter for images/videos only
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

export const upload = multer({ storage, fileFilter });
