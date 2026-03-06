import fs from "fs/promises";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import path from "path";

// Constants
const COLLECTION_NAME = "visitations";

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

function getDatabaseNameFromUri(uri: string): string | null {
  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, "").trim();
    return dbName || null;
  } catch {
    return null;
  }
}

function getDatabaseCandidates(uri?: string): string[] {
  const candidates = [
    process.env.MONGODB_DB,
    uri ? getDatabaseNameFromUri(uri) : null,
    "store-visits",
    "store-visitation-tracker",
  ];

  return Array.from(
    new Set(candidates.filter((name): name is string => Boolean(name))),
  );
}

export async function GET() {
  try {
    // Get environment variables at runtime
    const MONGODB_URI = process.env.MONGODB_URI;
    const databaseCandidates = getDatabaseCandidates(MONGODB_URI);
    const collectionCandidates = [COLLECTION_NAME, "store-visits"];

    // If configured to use MongoDB and URI exists, try Mongo first
    const useMongo = (process.env.USE_MONGO || "true").toLowerCase() === "true";
    if (useMongo && MONGODB_URI) {
      try {
        console.log("Attempting to connect to MongoDB...");
        const client = await getMongoClient(MONGODB_URI);
        const fetchedByKey = new Map<string, any>();

        for (const dbName of databaseCandidates) {
          for (const collectionName of collectionCandidates) {
            const collection = client.db(dbName).collection(collectionName);
            const records = await collection
              .find({})
              .sort({
                "metadata.createdAt": -1,
                submittedAt: -1,
                visitDate: -1,
              })
              .limit(200)
              .toArray();

            for (const record of records) {
              const key = String(
                record?._id ||
                  `${record?.metadata?.createdAt || ""}-${record?.submittedAt || ""}-${record?.storeName || ""}`,
              );
              if (!fetchedByKey.has(key)) {
                fetchedByKey.set(key, record);
              }
            }
          }
        }

        const submissions = Array.from(fetchedByKey.values())
          .sort((a: any, b: any) => {
            const dateA = new Date(
              a?.metadata?.createdAt ||
                a?.metadata?.submittedAt ||
                a?.submittedAt ||
                a?.visitDate ||
                0,
            ).getTime();
            const dateB = new Date(
              b?.metadata?.createdAt ||
                b?.metadata?.submittedAt ||
                b?.submittedAt ||
                b?.visitDate ||
                0,
            ).getTime();
            return dateB - dateA;
          })
          .slice(0, 100);

        console.log(`Retrieved ${submissions.length} submissions from MongoDB`);
        return NextResponse.json({
          success: true,
          data: submissions,
          count: submissions.length,
          message: "Submissions retrieved successfully (MongoDB)",
        });
      } catch (mongoErr) {
        console.warn(
          "MongoDB unavailable; falling back to file storage:",
          mongoErr instanceof Error ? mongoErr.message : String(mongoErr),
        );
        // fall through to file read
      }
    }

    // Fallback to local file storage
    try {
      const dataDir = path.join(process.cwd(), "data");
      const filePath = path.join(dataDir, "submissions.json");
      const fileContents = await fs.readFile(filePath, "utf8");
      const submissions = JSON.parse(fileContents || "[]");

      // Sort by date fields
      const sorted = (Array.isArray(submissions) ? submissions : []).sort(
        (a: any, b: any) => {
          const dateA = new Date(
            a.submittedAt || a.visitDate || a.metadata?.createdAt || 0,
          ).getTime();
          const dateB = new Date(
            b.submittedAt || b.visitDate || b.metadata?.createdAt || 0,
          ).getTime();
          return dateB - dateA;
        },
      );

      console.log(`Retrieved ${sorted.length} submissions from file storage`);
      return NextResponse.json({
        success: true,
        data: sorted.slice(0, 100),
        count: Array.isArray(sorted) ? sorted.length : 0,
        message: "Submissions retrieved successfully (file)",
      });
    } catch (fileErr) {
      console.warn(
        "Failed to read local submissions file:",
        fileErr instanceof Error ? fileErr.message : String(fileErr),
      );
      // Return empty array instead of error
      return NextResponse.json(
        {
          success: true,
          data: [],
          count: 0,
          message: "No submissions found",
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(
      "Error fetching submissions:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      {
        success: true,
        data: [],
        count: 0,
        message: "Error fetching submissions, returning empty list",
      },
      { status: 200 },
    );
  }
}

// Declare global type for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
