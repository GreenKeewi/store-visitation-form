import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testSubmissions() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    process.exit(1);
  }

  console.log("🔍 Testing MongoDB connection and submissions...\n");

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    // Try different database and collection combinations
    const databases = ["store-visits", "store-visitation-tracker", "test"];
    const collections = ["visitations", "store-visits"];

    let totalFound = 0;

    for (const dbName of databases) {
      for (const collName of collections) {
        try {
          const db = client.db(dbName);
          const collection = db.collection(collName);
          const count = await collection.countDocuments();

          if (count > 0) {
            console.log(`✅ Found ${count} documents in ${dbName}.${collName}`);

            // Show first document structure
            const sample = await collection.findOne({});
            console.log("Sample document structure:");
            console.log(JSON.stringify(sample, null, 2));
            console.log("\n");

            totalFound += count;
          }
        } catch {
          // Skip collections that don't exist
        }
      }
    }

    if (totalFound === 0) {
      console.log("⚠️ No documents found in any collection");
      console.log("\nTested databases:", databases.join(", "));
      console.log("Tested collections:", collections.join(", "));
    } else {
      console.log(`\n📊 Total submissions found: ${totalFound}`);
    }

    await client.close();
    console.log("\n✅ Connection closed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testSubmissions();
