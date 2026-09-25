import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "../models/AdminUser";

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL || "akhilkanil99@gmail.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!uri) {
    console.error("❌ ERROR: MONGODB_URI is not set in environment variables.");
    process.exit(1);
  }

  if (!password) {
    console.error("❌ ERROR: ADMIN_PASSWORD is not set in environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log(`ℹ️ Admin user with email "${email}" already exists. Will not overwrite.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await AdminUser.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    console.log(`✅ Admin user created successfully: ${email}`);
    console.log("🔒 Password has been securely hashed and stored.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error instanceof Error ? error.message : error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
