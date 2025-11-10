import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/powerloomDB");
    
    const email = process.argv[2];
    if (!email) {
      console.error("Please provide an email: node makeAdmin.js your@email.com");
      process.exit(1);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ User ${user.email} is now an admin!`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

makeAdmin();
