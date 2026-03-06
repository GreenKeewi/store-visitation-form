import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Reuse client across module reloads in development to avoid exhausting connections
let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export { clientPromise };

export async function getDb(dbName?: string) {
  const client = await clientPromise!;
  return client.db(dbName || process.env.MONGODB_DB || "store-visits");
}

export default clientPromise;
