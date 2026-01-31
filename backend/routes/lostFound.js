import express from 'express';
import LostFound from '../models/LostFound.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all lost/found items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await LostFound.find().populate('reportedByUser claimedByUser');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create lost/found item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    data.reportedBy = req.user._id;
    const item = await LostFound.create(data);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Claim item
router.put('/:id/claim', authenticateToken, async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.status = 'claimed';
    item.claimedBy = req.user._id;
    item.claimedAt = new Date();
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
