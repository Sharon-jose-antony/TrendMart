const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const db = require('./db');
const MongoDBStore = require('./mongo');

async function runSeed() {
  const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set. Copy .env.example to .env and configure MONGO_URI first.');
    process.exit(1);
  }

  const store = new MongoDBStore();
  try {
    console.log('🔌 Connecting to MongoDB...');
    await store.connect(mongoUri);
    const jsonData = db.getJsonData();
    await store.resetData(jsonData);
    console.log(
      `✅ Seeded MongoDB from server/data/trendmart_db.json (` +
      `${(jsonData.categories || []).length} categories, ` +
      `${(jsonData.sellers || []).length} sellers, ` +
      `${(jsonData.customers || []).length} customers, ` +
      `${(jsonData.products || []).length} products, ` +
      `${(jsonData.orders || []).length} orders, ` +
      `${(jsonData.banners || []).length} banners).`
    );
  } catch (err) {
    console.error('❌ Failed to seed MongoDB:', err.message);
    process.exitCode = 1;
  } finally {
    await store.disconnect();
  }
}

runSeed();
