import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testGetSubmissionsLogic() {
  const uri = process.env.MONGODB_URI;
  const COLLECTION_NAME = "visitations";

  console.log("🔍 Testing get-submissions API logic...\n");

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxIdleTimeMS: 30000,
    });

    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    // Test the same logic as get-submissions API
    const databaseCandidates = [
      process.env.MONGODB_DB,
      "store-visits",
      "store-visitation-tracker",
    ].filter(Boolean);

    const collectionCandidates = [COLLECTION_NAME, "store-visits"];

    console.log("Database candidates:", databaseCandidates);
    console.log("Collection candidates:", collectionCandidates);
    console.log("");

    const fetchedByKey = new Map();

    for (const dbName of databaseCandidates) {
      for (const collectionName of collectionCandidates) {
        try {
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

          console.log(
            `📁 ${dbName}.${collectionName}: ${records.length} records`,
          );

          for (const record of records) {
            const key = String(record._id);
            if (!fetchedByKey.has(key)) {
              fetchedByKey.set(key, record);
            }
          }
        } catch (err) {
          console.log(`❌ ${dbName}.${collectionName}: ${err.message}`);
        }
      }
    }

    const submissions = Array.from(fetchedByKey.values())
      .sort((a, b) => {
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

    console.log(`\n✅ Total unique submissions: ${submissions.length}`);

    if (submissions.length > 0) {
      console.log("\nFirst submission:");
      console.log(JSON.stringify(submissions[0], null, 2));
    }

    await client.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testGetSubmissionsLogic();
