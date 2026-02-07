import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost','found'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  location: String,
  date: { type: Date, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending','claimed','closed'], default: 'pending' },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: { type: Date }, // track when claimed
}, { timestamps: true });

export default mongoose.model('LostFound', lostFoundSchema);
