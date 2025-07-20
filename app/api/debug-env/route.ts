import { NextResponse } from "next/server";

export async function GET() {
  // Manual environment variable loading test
  const envTest = {
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI?.length || 0,
    mongoUriPreview: process.env.MONGODB_URI?.substring(0, 50) + "...",
    mongoDb: process.env.MONGODB_DB,
    nodeEnv: process.env.NODE_ENV,
    allMongoKeys: Object.keys(process.env).filter((k) => k.includes("MONGO")),
    totalEnvVars: Object.keys(process.env).length,
    someOtherEnvVars: Object.keys(process.env).slice(0, 10),
  };

  console.log("Environment test results:", envTest);

  return NextResponse.json(envTest);
}

export async function POST() {
  // Test if environment variables are available in POST requests
  const result = {
    timestamp: new Date().toISOString(),
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriExists: "MONGODB_URI" in process.env,
    processEnvKeys: Object.keys(process.env).length,
  };

  console.log("POST environment test:", result);

  return NextResponse.json(result);
}
