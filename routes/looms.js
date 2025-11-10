import express from "express";
import { getLooms, updateLoom } from "../controllers/loomController.js";
const router = express.Router();
router.get("/", getLooms);
router.put("/:id", updateLoom);
export default router;
