import express from 'express';
import Announcement from '../models/Announcement.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all announcements
router.get('/', authenticateToken, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create announcement (management only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('management'),
  async (req, res) => {
    try {
      const announcement = await Announcement.create({
        ...req.body,
        createdBy: req.user.id, // ✅ FIXED
      });

      res.status(201).json(announcement);
    } catch (err) {
      console.error('Create announcement error:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
