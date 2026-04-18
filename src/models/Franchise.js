import mongoose from 'mongoose';

const FranchiseSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, trim: true, lowercase: true },
    phone:      { type: String, required: true, trim: true },
    city:       { type: String, required: true, trim: true },
    state:      { type: String, required: true, trim: true },
    investment: { type: String, required: true }, // budget range
    spaceArea:  { type: String },                 // sq ft available
    experience: { type: String },                 // business background
    message:    { type: String },
    status:     { type: String, enum: ['new', 'contacted', 'approved', 'rejected'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.models.Franchise || mongoose.model('Franchise', FranchiseSchema);
