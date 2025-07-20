// MongoDB Data Population Script
// Run this script to populate your MongoDB with initial dropdown data

import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });

async function populateDropdownData() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "store-visitation-tracker";

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    return;
  }

  console.log("🔄 Connecting to MongoDB...");

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);

    // Territory Managers Data
    const territoryManagers = [
      { name: "Tom Scott", active: true, createdAt: new Date() },
      { name: "John Smith", active: true, createdAt: new Date() },
      { name: "Tim Horton", active: true, createdAt: new Date() },
      { name: "Mason Anderson", active: true, createdAt: new Date() },
      { name: "Liam Miller", active: true, createdAt: new Date() },
    ];

    // Stores Data
    const stores = [
      {
        name: "Cambridge Heating and Cooling",
        number: "CHC001",
        address: "123 Main St, Cambridge",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others",
        number: "OTH001",
        address: "Various Locations",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others 2",
        number: "OTH002",
        address: "Various Locations",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others 3",
        number: "OTH003",
        address: "Various Locations",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others 4",
        number: "OTH004",
        address: "Various Locations",
        active: true,
        createdAt: new Date(),
      },
    ];

    // Service Providers Data
    const serviceProviders = [
      {
        name: "Cambridge Heating and Cooling",
        type: "HVAC",
        contact: "service@cambridge-hvac.com",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others",
        type: "General",
        contact: "contact@others.com",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others 2",
        type: "General",
        contact: "contact@others2.com",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others 3",
        type: "General",
        contact: "contact@others3.com",
        active: true,
        createdAt: new Date(),
      },
      {
        name: "Others 4",
        type: "General",
        contact: "contact@others4.com",
        active: true,
        createdAt: new Date(),
      },
    ];

    // Insert Territory Managers
    console.log("📝 Inserting Territory Managers...");
    const tmCollection = db.collection("territory-managers");

    // Clear existing data
    await tmCollection.deleteMany({});

    // Insert new data
    const tmResult = await tmCollection.insertMany(territoryManagers);
    console.log(`✅ Inserted ${tmResult.insertedCount} territory managers`);

    // Insert Stores
    console.log("📝 Inserting Stores...");
    const storesCollection = db.collection("stores");

    // Clear existing data
    await storesCollection.deleteMany({});

    // Insert new data
    const storesResult = await storesCollection.insertMany(stores);
    console.log(`✅ Inserted ${storesResult.insertedCount} stores`);

    // Insert Service Providers
    console.log("📝 Inserting Service Providers...");
    const spCollection = db.collection("service-providers");

    // Clear existing data
    await spCollection.deleteMany({});

    // Insert new data
    const spResult = await spCollection.insertMany(serviceProviders);
    console.log(`✅ Inserted ${spResult.insertedCount} service providers`);

    console.log("");
    console.log("🎉 Database populated successfully!");
    console.log("");
    console.log("📊 Summary:");
    console.log(`   Territory Managers: ${tmResult.insertedCount}`);
    console.log(`   Stores: ${storesResult.insertedCount}`);
    console.log(`   Service Providers: ${spResult.insertedCount}`);
    console.log("");
    console.log(
      "💡 You can now add/edit/remove items directly in MongoDB and they will appear in your form automatically!"
    );

    await client.close();
    console.log("🔒 Database connection closed");
  } catch (error) {
    console.error("❌ Error populating database:", error);
  }
}

// Run the population script
populateDropdownData();
