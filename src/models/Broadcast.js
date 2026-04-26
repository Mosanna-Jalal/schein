import mongoose from 'mongoose';

const BroadcastSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sentCount: { type: Number, default: 0 },
    totalSubscribers: { type: Number, default: 0 },
    status: { type: String, enum: ['sent', 'partial', 'failed'], default: 'sent' },
    error: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Broadcast || mongoose.model('Broadcast', BroadcastSchema);
