import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  replies: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const reactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'dislike', 'urgent', 'helpful'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['general', 'maintenance', 'cleaning', 'pest_control', 'water', 'electricity'],
    default: 'general'
  },
  targetHostel: String,
  targetBlock: String,
  targetRole: {
    type: String,
    enum: ['student', 'management', 'all'],
    default: 'all'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: Date,
  isActive: { type: Boolean, default: true },

  comments: { type: [commentSchema], default: [] },   // ✅
  reactions: { type: [reactionSchema], default: [] }  // ✅
}, { timestamps: true });

// Indexes
announcementSchema.index({ title: 'text', content: 'text' });
announcementSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.model('Announcement', announcementSchema);



