import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// MongoDB Atlas connection configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DB || "store-visitation-tracker";
const COLLECTION_NAME = "store-visits";

let client: MongoClient;

if (!global._mongoClientPromise) {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }
  client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
const mongoClientPromise = global._mongoClientPromise;

export async function GET() {
  try {
    // Validate environment
    if (!MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Connect to MongoDB Atlas
    const client = await mongoClientPromise;
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Get all submissions, sorted by most recent first
    const submissions = await collection
      .find({})
      .sort({ "metadata.createdAt": -1 })
      .limit(100) // Limit to last 100 submissions
      .toArray();

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions.length,
      message: "Submissions retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching from MongoDB Atlas:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from database" },
      { status: 500 }
    );
  }
}

// Declare global type for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
