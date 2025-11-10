import express from "express";
import { weeklyDeliveryStats } from "../controllers/dashboardController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Protected dashboard route
router.get("/", auth, async (req, res) => {
  try {
    const stats = {
      machinesRunning: 12,
      productionRate: "87%",
      weeklyOutput: 342,
    };
    res.json({ message: "Dashboard data loaded successfully", stats });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// Weekly stats route
router.get("/weekly", weeklyDeliveryStats);

export default router;