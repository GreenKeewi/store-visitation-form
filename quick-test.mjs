// Quick MongoDB Connection Test
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'store-visitation-tracker';

  console.log('MongoDB Connection Test');
  console.log('=====================');
  console.log('URI exists:', !!uri);
  console.log('URI preview:', uri ? uri.substring(0, 50) + '...' : 'undefined');
  console.log('Database name:', dbName);

  if (!uri) {
    console.error('❌ MONGODB_URI not found');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connection successful!');
    
    const db = client.db(dbName);
    const collection = db.collection('store-visits');
    const count = await collection.countDocuments();
    console.log('📊 Documents in collection:', count);
    
    await client.close();
    console.log('🔒 Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
