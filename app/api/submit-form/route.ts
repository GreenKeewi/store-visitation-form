import { randomUUID } from "crypto";
import fs from "fs/promises";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Constants
const COLLECTION_NAME = "visitations";

// Rate limiting for production
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 10; // max requests per window

// Global client promise for connection reuse
let mongoClientPromise: Promise<MongoClient> | null = null;

type SubmissionRecord = Record<string, unknown>;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

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

function getDatabaseNameFromUri(uri: string): string | null {
  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, "").trim();
    return dbName || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  console.log("API route called - starting POST handler");
  console.log(
    "Process environment keys:",
    Object.keys(process.env).filter((k) => k.includes("MONGO")),
  );

  try {
    // Try multiple ways to get environment variables
    const MONGODB_URI = process.env.MONGODB_URI;
    const DATABASE_NAME =
      process.env.MONGODB_DB ||
      getDatabaseNameFromUri(MONGODB_URI || "") ||
      "store-visits";

    // Enhanced debug logging
    console.log("Environment check:");
    console.log("- process.env.MONGODB_URI:", !!process.env.MONGODB_URI);
    console.log("- MONGODB_URI length:", MONGODB_URI?.length || 0);
    console.log("- DATABASE_NAME:", DATABASE_NAME);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log(
      "- All env keys:",
      Object.keys(process.env).filter((key) => key.includes("MONGO")),
    );

    // Validate environment with detailed error
    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set");
      console.error(
        "Available env vars:",
        Object.keys(process.env).filter((k) => k.includes("MONGO")),
      );
      return NextResponse.json(
        {
          error: "Database configuration error",
          debug: "MONGODB_URI not found in environment variables",
          availableEnvVars: Object.keys(process.env).filter((k) =>
            k.includes("MONGO"),
          ),
          allEnvCount: Object.keys(process.env).length,
        },
        { status: 500 },
      );
    }

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
          { status: 429 },
        );
      } else {
        current.count++;
      }
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
        { status: 400 },
      );
    }

    console.log("Connecting to MongoDB or falling back to local storage...");

    // Prepare document with audit information
    const documentBase = {
      ...body,
      metadata: {
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") || "unknown",
        submittedAt: new Date().toISOString(),
        createdAt: new Date(),
      },
    };

    // If explicitly configured to use MongoDB and a URI exists, try Mongo first
    const useMongo = (process.env.USE_MONGO || "true").toLowerCase() === "true";

    if (useMongo && MONGODB_URI) {
      try {
        // Connect to MongoDB Atlas with timeout
        const client = await Promise.race([
          getMongoClient(MONGODB_URI),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Connection timeout after 10 seconds")),
              10000,
            ),
          ),
        ]);

        console.log("Connected to MongoDB, preparing document...");

        // Test the connection by pinging the database
        await client.db("admin").command({ ping: 1 });
        console.log("Database ping successful");

        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Insert the document into MongoDB
        const result = await collection.insertOne(documentBase);

        console.log(
          "Document inserted successfully to MongoDB:",
          result.insertedId,
        );

        return NextResponse.json({
          success: true,
          id: result.insertedId,
          message: "Store visit form submitted successfully (MongoDB)",
        });
      } catch (mongoErr) {
        console.warn(
          "MongoDB unavailable or failed; falling back to local storage:",
          getErrorMessage(mongoErr),
        );
        // fall through to file storage
      }
    }

    // Fallback: store submissions in a local JSON file
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "submissions.json");

    // Ensure directory exists
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (mkdirErr) {
      console.error("Failed to create data directory:", mkdirErr);
    }

    // Read existing submissions
    let submissions: SubmissionRecord[] = [];
    try {
      const fileContents = await fs.readFile(filePath, "utf8");
      const parsedData: unknown = JSON.parse(fileContents || "[]");
      if (Array.isArray(parsedData)) {
        submissions = parsedData.filter(
          (item): item is SubmissionRecord =>
            typeof item === "object" && item !== null,
        );
      }
    } catch {
      // If file does not exist or is invalid, we'll create a new one
      submissions = [];
    }

    const newDoc = { id: randomUUID(), ...documentBase };
    submissions.unshift(newDoc); // newest first

    // Write back (atomic write could be added if needed)
    try {
      await fs.writeFile(
        filePath,
        JSON.stringify(submissions, null, 2),
        "utf8",
      );
      console.log("Document saved to local file storage with id:", newDoc.id);
      return NextResponse.json({
        success: true,
        id: newDoc.id,
        message: "Store visit form submitted successfully (file)",
      });
    } catch (writeErr) {
      console.error("Failed to write submission to file:", writeErr);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 },
      );
    }
  } catch (error) {
    // Get MONGODB_URI for error logging (in case it was set during the try block)
    const MONGODB_URI = process.env.MONGODB_URI;

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
      { status: 500 },
    );
  }
}
