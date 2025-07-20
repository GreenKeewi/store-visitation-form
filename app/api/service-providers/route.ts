import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Global client promise for connection reuse
let mongoClientPromise: Promise<MongoClient> | null = null;

function getMongoClient(uri: string): Promise<MongoClient> {
  if (!mongoClientPromise) {
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

    if (!MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    const client = await getMongoClient(MONGODB_URI);
    const db = client.db(DATABASE_NAME);
    const collection = db.collection("service-providers");

    // Fetch service providers, sorted alphabetically
    const serviceProviders = await collection
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: serviceProviders.map((sp) => ({
        value: sp.name,
        label: sp.name,
        id: sp._id.toString(),
        active: sp.active !== false, // Default to true if not specified
      })),
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch service providers" },
      { status: 500 }
    );
  }
}
