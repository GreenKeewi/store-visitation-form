// Simple environment test script
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.log("Environment Variables Test:");
console.log("=========================");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log(
  "MONGODB_URI preview:",
  process.env.MONGODB_URI
    ? process.env.MONGODB_URI.substring(0, 50) + "..."
    : "undefined"
);
console.log("MONGODB_DB:", process.env.MONGODB_DB);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("");
console.log('All environment variables containing "MONGO":');
Object.keys(process.env)
  .filter((key) => key.includes("MONGO"))
  .forEach((key) => {
    console.log(`- ${key}:`, process.env[key] ? "SET" : "NOT SET");
  });
