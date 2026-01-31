import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ['plumbing', 'electrical', 'cleanliness', 'internet', 'furniture', 'other'],
      required: true,
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'low',
    },

    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },

    // ✅ SINGLE STRING LOCATION
    location: {
      type: String,
      required: true,
      trim: true,
    },

    media: [String],

    status: {
      type: String,
      default: 'reported',
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Issue', issueSchema);
