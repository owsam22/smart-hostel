import express from 'express';
import Issue from '../models/Issue.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/* ADD ISSUE */
router.post(
  '/',
  authenticateToken,
  upload.array('media', 5),
  async (req, res) => {
    try {
      const { title, description, category, priority, visibility, location } = req.body;

      if (!title || !description || !category || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const mediaPaths = req.files?.map(f => `/uploads/issues/${f.filename}`) || [];

      const issue = await Issue.create({
        title,
        description,
        category,
        priority,
        visibility,
        location,
        media: mediaPaths,
        reportedBy: req.user.id,
      });

      res.status(201).json(issue);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to add issue' });
    }
  }
);

// Media upload route
router.post('/upload', authenticateToken, upload.array('media', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => `/uploads/issues/${file.filename}`);
    res.json(filePaths);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Media upload failed' });
  }
});

/* GET ISSUES */
router.get('/', authenticateToken, async (req, res) => {
  const issues = await Issue.find()
    .populate('reportedBy', 'name email role')
    .sort({ createdAt: -1 });
  res.json(issues);
});

/* UPDATE ISSUE */
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'management') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update issue' });
  }
});

export default router;
