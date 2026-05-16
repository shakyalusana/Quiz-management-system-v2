// seed/superAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/user.js";

dotenv.config();

// DB Connection
const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Connection Error:", error);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  try {
    await initDB();

    // Check if superadmin already exists
    const admin = await User.findOne({
      email: "admin@quizgame.com",
    });

    if (!admin) {
      // Hash password
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await User.create({
        name: "Super Admin",
        email: "admin@quizgame.com",
        password: hashedPassword,
        role: "superadmin",
      });

      console.log("Superadmin created successfully!");
    } else {
      console.log("Superadmin already exists.");
    }

    mongoose.connection.close();
  } catch (error) {
    console.log("Error creating superadmin:", error);
  }
};

createSuperAdmin();
