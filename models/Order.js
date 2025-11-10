import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  meters: Number,
  pricePerMeter: Number
});

const OrderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  items: [OrderItemSchema],
  totalAmount: Number,
  amountSettled: { type: Number, default: 0 },
  status: { type: String, enum: ["pending","confirmed","weaving","quality","dispatched","delivered","cancelled"], default: "pending" },
  placedAt: { type: Date, default: Date.now },
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String
});

export default mongoose.model("Order", OrderSchema);
