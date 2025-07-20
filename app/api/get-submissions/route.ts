import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Constants
const COLLECTION_NAME = "store-visits";

// Global client promise for connection reuse
let mongoClientPromise: Promise<MongoClient> | null = null;

function getMongoClient(uri: string): Promise<MongoClient> {
  if (!mongoClientPromise) {
    // MongoDB connection options for better reliability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
    };

    const client = new MongoClient(uri, options);
    mongoClientPromise = client.connect();
  }
  return mongoClientPromise;
}

export async function GET() {
  try {
    // Get environment variables at runtime
    const MONGODB_URI = process.env.MONGODB_URI;
    const DATABASE_NAME = process.env.MONGODB_DB || "store-visitation-tracker";

    // Validate environment
    if (!MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Connect to MongoDB Atlas
    const client = await getMongoClient(MONGODB_URI);
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
