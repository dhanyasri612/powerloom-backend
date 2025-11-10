import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productsRouter from "./routes/products.js";
import uploadRouter from "./routes/upload.js";
import path from "path";
import ordersRouter from "./routes/orders.js";
import loomsRouter from "./routes/looms.js";
import analyticsRouter from "./routes/analytics.js";
import Loom from "./models/Loom.js";
import authRoutes from "./routes/authRoutes.js";
import dashboard from "./routes/dashboard.js";

// ------------------------
// Load environment variables
// ------------------------
dotenv.config();

// ------------------------
// Initialize express app
// ------------------------
const app = express();

// ------------------------
// Middleware
// ------------------------
app.use(
  cors({
    origin: ["https://powerloom-frontend-rpgj.vercel.app"], // your live frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ------------------------
// Connect to MongoDB
// ------------------------
try {
  await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/powerloom");
  console.log("✅ MongoDB Connected Successfully");
} catch (err) {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1);
}

// ------------------------
// Routes
// ------------------------
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboard);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/looms", loomsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/upload", uploadRouter);

// ------------------------
// Serve uploaded files statically
// ------------------------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ------------------------
// Root route (for testing)
// ------------------------
app.get("/", (req, res) => res.send("Powerloom API running"));

// ------------------------
// Socket.IO setup
// ------------------------
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: "https://powerloom-frontend-rpgj.vercel.app" },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("subscribe:looms", async () => {
    try {
      const looms = await Loom.find().populate("currentProduct");
      socket.emit("looms:init", looms);
    } catch (err) {
      console.error("Socket loom error:", err.message);
    }
  });

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// ------------------------
// Global error handler
// ------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ------------------------
// Start server
// ------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
