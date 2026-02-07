import express from 'express';
import LostFound from '../models/LostFound.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all lost/found items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await LostFound.find()
      .populate('reportedBy', 'name email role')
      .populate('claimedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create lost/found item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const item = await LostFound.create({
      ...req.body,
      reportedBy: req.user.id, // 🔥 FIXED (token uses id, not _id)
    });

    const populated = await item.populate('reportedBy', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Claim item
router.put('/:id/claim', authenticateToken, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.status = 'claimed';
    item.claimedBy = req.user.id;
    item.claimedAt = new Date();
    await item.save();

    const populated = await item
      .populate('reportedBy', 'name email role')
      .populate('claimedBy', 'name email role');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
