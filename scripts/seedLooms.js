#!/usr/bin/env node

import mongoose from "mongoose";
import dotenv from "dotenv";
import Loom from "../models/Loom.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/powerloom";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to:", MONGO_URI);

    const upserts = [];
    for (let i = 1; i <= 8; i++) {
      const loomId = `L-${100 + i}`;
      upserts.push(
        Loom.updateOne(
          { loomId },
          {
            $set: { lastUpdated: new Date() },
            $setOnInsert: {
              loomId,
              isRunning: i % 2 === 1,
              currentProduct: null,
              rpm: i % 2 === 1 ? 220 : 0,
            },
          },
          { upsert: true }
        )
      );
    }

    await Promise.all(upserts);
    const looms = await Loom.find().select(
      "loomId isRunning rpm currentProduct"
    );
    console.log("Seeded/ensured looms:");
    looms.forEach((l) => console.log(l.toObject()));
  } catch (err) {
    console.error("Error seeding looms:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();

