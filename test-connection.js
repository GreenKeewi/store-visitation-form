// MongoDB Connection Test Script
// Run this to test your MongoDB Atlas connection

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config({ path: ".env.local" });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "store-visitation-tracker";

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    console.log(
      "Make sure to set your MongoDB Atlas connection string in .env.local"
    );
    return;
  }

  if (uri.includes("<db_password>")) {
    console.error(
      "❌ Please replace <db_password> with your actual MongoDB password"
    );
    return;
  }

  console.log("🔄 Testing MongoDB Atlas connection...");

  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log("✅ Successfully connected to MongoDB Atlas!");

    // Test database operations
    const db = client.db(dbName);
    const collection = db.collection("store-visits");

    // Check if we can perform operations
    const count = await collection.countDocuments();
    console.log(`📊 Current documents in collection: ${count}`);

    await client.close();
    console.log("✅ Connection test completed successfully!");
    console.log("\n🚀 Your application is ready for production!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your password in the connection string");
    console.log("2. Ensure your IP is whitelisted in MongoDB Atlas");
    console.log("3. Verify your cluster is running");
  }
}

testConnection();
