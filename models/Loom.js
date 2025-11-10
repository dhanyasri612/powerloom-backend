import mongoose from "mongoose";

const LoomSchema = new mongoose.Schema({
  loomId: { type: String, required: true, unique: true },
  isRunning: { type: Boolean, default: true },
  currentProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  rpm: { type: Number, default: 200 },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Loom", LoomSchema);