import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import Loom from "./models/Loom.js";
import Order from "./models/Order.js";

dotenv.config();

const run = async () => {
  await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/powerloomDB");

  await Product.deleteMany({});
  await Loom.deleteMany({});
  await Order.deleteMany({});

  const p1 = await Product.create({
    name: "Kerala Saree - Classic",
    slug: "kerala-saree-classic",
    description: "Traditional Kerala saree fabric, fine finish.",
    pricePerMeter: 220,
    images: [],
    categories: ["saree"],
    gsm: 120,
    width: "44 inch",
    stockMeters: 1000
  });

  const p2 = await Product.create({
    name: "Uniform Fabric - Sturdy",
    slug: "uniform-fabric",
    description: "Durable fabric for school uniforms.",
    pricePerMeter: 130,
    images: [],
    categories: ["uniform"],
    gsm: 180,
    width: "58 inch",
    stockMeters: 2000
  });

  await Loom.create({ loomId: "L-101", isRunning: true, currentProduct: p1._id, rpm: 230 });
  await Loom.create({ loomId: "L-102", isRunning: false, currentProduct: p2._id, rpm: 0 });

  // create a delivered order 3 days ago
  const past = new Date(); past.setDate(past.getDate() - 3);
  await Order.create({
    customerName: "Local Traders",
    customerEmail: "traders@example.com",
    items: [{ product: p1._id, meters: 150, pricePerMeter: p1.pricePerMeter }],
    totalAmount: 150 * p1.pricePerMeter,
    amountSettled: 150 * p1.pricePerMeter,
    status: "delivered",
    placedAt: past,
    estimatedDelivery: past,
    deliveredAt: past
  });

  console.log("Seed finished");
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
