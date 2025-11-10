import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  pricePerMeter: { type: Number, default: 0 },
  images: [String],
  categories: [String],
  gsm: Number,
  width: String,
  stockMeters: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", ProductSchema);
