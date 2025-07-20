import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// MongoDB Atlas connection configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DB || "store-visitation-tracker";
const COLLECTION_NAME = "store-visits";

// Rate limiting for production
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // max requests per window

let client: MongoClient;

if (!global._mongoClientPromise) {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  // MongoDB connection options for better reliability
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
  };

  client = new MongoClient(MONGODB_URI, options);
  global._mongoClientPromise = client.connect();
}
const mongoClientPromise = global._mongoClientPromise;

export async function POST(request: NextRequest) {
  console.log("API route called - starting POST handler");

  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const now = Date.now();

    console.log("Request IP:", ip);

    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
      const current = rateLimit.get(ip);
      if (now > current.resetTime) {
        rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      } else {
        current.count++;
      }
    }

    // Validate environment
    if (!MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    console.log("Getting request body...");
    const body = await request.json();
    console.log("Request body received:", body);

    // Validate required fields
    if (!body.territoryManager || !body.storeName || !body.serviceProvider) {
      console.error("Validation failed - missing required fields:", {
        territoryManager: !!body.territoryManager,
        storeName: !!body.storeName,
        serviceProvider: !!body.serviceProvider,
      });
      return NextResponse.json(
        {
          error:
            "Territory Manager, Store Name, and Service Provider are required",
        },
        { status: 400 }
      );
    }

    console.log("Connecting to MongoDB...");

    // Connect to MongoDB Atlas with timeout
    const client = (await Promise.race([
      mongoClientPromise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connection timeout after 10 seconds")),
          10000
        )
      ),
    ])) as MongoClient;

    console.log("Connected to MongoDB, preparing document...");

    // Test the connection by pinging the database
    await client.db("admin").command({ ping: 1 });
    console.log("Database ping successful");

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Prepare document with audit information
    const document = {
      ...body,
      metadata: {
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || "unknown",
        submittedAt: new Date().toISOString(),
        createdAt: new Date(),
      },
    };

    console.log("Inserting document into collection...");
    // Insert the document
    const result = await collection.insertOne(document);

    console.log("Document inserted successfully:", result.insertedId);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Store visit form submitted successfully",
    });
  } catch (error) {
    console.error("Error saving to MongoDB Atlas:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      name: error instanceof Error ? error.name : "Unknown",
      mongoUri: MONGODB_URI ? `${MONGODB_URI.substring(0, 25)}...` : "Not set",
    });

    // Provide more specific error messages based on common MongoDB errors
    let errorMessage = "Failed to save data to database";
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        errorMessage =
          "Database authentication failed - check username/password";
      } else if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        errorMessage =
          "Database connection timeout - check network/IP whitelist";
      } else if (error.message.includes("not authorized")) {
        errorMessage = "Database access denied - check user permissions";
      } else {
        errorMessage = `Database error: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.name : "Unknown",
      },
      { status: 500 }
    );
  }
}

// Declare global type for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Declare global type for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
