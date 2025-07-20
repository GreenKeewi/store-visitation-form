import { NextResponse } from "next/server";

export async function GET() {
  console.log("Environment test route called");

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB;
  const NODE_ENV = process.env.NODE_ENV;

  console.log("Environment variables:");
  console.log("- MONGODB_URI exists:", !!MONGODB_URI);
  console.log(
    "- MONGODB_URI preview:",
    MONGODB_URI ? MONGODB_URI.substring(0, 30) + "..." : "undefined"
  );
  console.log("- MONGODB_DB:", MONGODB_DB);
  console.log("- NODE_ENV:", NODE_ENV);

  return NextResponse.json({
    hasMongoUri: !!MONGODB_URI,
    mongoUriPreview: MONGODB_URI
      ? MONGODB_URI.substring(0, 30) + "..."
      : "undefined",
    mongoDb: MONGODB_DB,
    nodeEnv: NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter((key) => key.includes("MONGO")),
  });
}
