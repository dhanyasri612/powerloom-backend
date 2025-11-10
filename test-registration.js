#!/usr/bin/env node

import mongoose from "mongoose";
import User from "./models/User.js";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/powerloomDB");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const testRegistration = async () => {
  await connectDB();

  try {
    console.log("\n🧪 Testing User Registration...");

    // Check if users collection exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const hasUsersCollection = collections.some((col) => col.name === "users");
    console.log("Users collection exists:", hasUsersCollection);

    // Try to create a test user
    const testUser = new User({
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword123",
    });

    await testUser.save();
    console.log("✅ Test user created successfully:", {
      id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
    });

    // Clean up test user
    await User.deleteOne({ email: "test@example.com" });
    console.log("✅ Test user cleaned up");

    // Check existing users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await User.find().select("name email role createdAt");
      console.log("Existing users:");
      users.forEach((user, index) => {
        console.log(
          `  ${index + 1}. ${user.name} (${user.email}) - ${user.role}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Registration test failed:", error.message);

    if (error.code === 11000) {
      console.log(
        "💡 This is a duplicate email error - the user already exists"
      );
    }
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

testRegistration();

