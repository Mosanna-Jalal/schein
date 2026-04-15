import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Kid', 'Women', 'Unisex', 'Accessories'],
    },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    stock: { type: Number, default: 100 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
