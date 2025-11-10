import express from "express";
import { weeklyDeliveryStats } from "../controllers/analyticsController.js";
const router = express.Router();
router.get("/weekly", weeklyDeliveryStats);
export default router;
