/*import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { catchAsync } from "../middleware/errors.js";

const router = express.Router();

router.post("/register", catchAsync(async (req, res) => {
  const { name = "", email = "", password = "" } = req.body;
  
  if (!name.trim() || !email.trim() || password.length < 8) {
    return res.status(400).json({ message: "Invalid input. Password must be at least 8 characters." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ 
    name: name.trim(), 
    email: email.toLowerCase(), 
    password: hashed
  });

  return res.status(201).json({ 
    id: user._id, 
    name: user.name, 
    email: user.email 
  });
}));

router.post("/login", catchAsync(async (req, res) => {
  const { email = "", password = "" } = req.body;
  
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET || "secretkey", 
    { expiresIn: "1d" }
  );
  
  return res.json({ 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role 
    } 
  });
}));

export default router;*/

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsync } from "../middleware/errors.js";

const router = express.Router();

// REGISTER
router.post("/register", catchAsync(async (req, res) => {
  const { name = "", email = "", password = "", role = "user" } = req.body;

  if (!name.trim() || !email.trim() || password.length < 8) {
    return res.status(400).json({ message: "Invalid input. Password must be at least 8 characters." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Use the schema's pre-save hashing
  const user = await User.create({ 
    name: name.trim(), 
    email: email.toLowerCase(), 
    password,
    role
  });

  return res.status(201).json({ 
    id: user._id, 
    name: user.name, 
    email: user.email,
    role: user.role
  });
}));

// LOGIN
router.post("/login", catchAsync(async (req, res) => {
  const { email = "", password = "" } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET || "secretkey", 
    { expiresIn: "1d" }
  );

  return res.json({ 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role
    } 
  });
}));

export default router;

