// Simple MongoDB connection test for Next.js API
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  // Get environment variables at runtime, not at module load time
  const MONGODB_URI = process.env.MONGODB_URI;
  const DATABASE_NAME = process.env.MONGODB_DB || "store-visitation-tracker";

  console.log("Testing MongoDB connection...");
  console.log("MONGODB_URI exists:", !!MONGODB_URI);
  console.log("DATABASE_NAME:", DATABASE_NAME);
  console.log("Environment variables loaded at runtime");

  if (!MONGODB_URI) {
    return NextResponse.json(
      { error: "MONGODB_URI environment variable is not defined" },
      { status: 500 }
    );
  }

  if (MONGODB_URI.includes("<db_password>")) {
    return NextResponse.json(
      {
        error: "Please replace <db_password> with your actual MongoDB password",
      },
      { status: 500 }
    );
  }

  try {
    console.log("Creating MongoDB client...");
    const client = new MongoClient(MONGODB_URI);

    console.log("Connecting to MongoDB...");
    await client.connect();

    console.log("Testing database operations...");
    const db = client.db(DATABASE_NAME);
    const collection = db.collection("store-visits");

    // Test basic operations
    const count = await collection.countDocuments();
    console.log("Document count:", count);

    await client.close();
    console.log("Connection test successful!");

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      documentCount: count,
      database: DATABASE_NAME,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      {
        error: "MongoDB connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        mongodb_uri_prefix: MONGODB_URI.substring(0, 20) + "...",
      },
      { status: 500 }
    );
  }
}
