import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'mcdonalds-clone';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Extract database name from URI or use default
function getDatabaseName(uri: string): string {
  const pathMatch = uri.match(/\/([^?\/]+)(\?|$)/);
  if (pathMatch && pathMatch[1] && pathMatch[1] !== 'test' && !pathMatch[1].includes('@')) {
    return pathMatch[1];
  }
  return DB_NAME;
}

const DATABASE_NAME = getDatabaseName(MONGODB_URI);

async function testConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined');
    process.exit(1);
  }
  
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log(`📦 Database: ${DATABASE_NAME}`);
    console.log(`🔗 URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');

    const db = client.db(DATABASE_NAME);
    
    // Test database operations
    console.log('\n📊 Testing database operations...');
    
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Collections found: ${collections.length}`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    // Check data counts
    const productCount = await db.collection('products').countDocuments();
    const dealCount = await db.collection('deals').countDocuments();
    const storeCount = await db.collection('stores').countDocuments();
    const userCount = await db.collection('users').countDocuments();
    const orderCount = await db.collection('orders').countDocuments();

    console.log('\n📈 Data counts:');
    console.log(`   Products: ${productCount}`);
    console.log(`   Deals: ${dealCount}`);
    console.log(`   Stores: ${storeCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Orders: ${orderCount}`);

    if (productCount === 0 && dealCount === 0 && storeCount === 0) {
      console.log('\n⚠️  No data found in database. Run the seed script:');
      console.log('   npm run seed');
      console.log('   or');
      console.log('   npx ts-node scripts/seed-direct.ts');
    } else {
      console.log('\n✅ Database connection and data look good!');
    }

  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n🔧 Fix: Add your IP address to MongoDB Atlas whitelist:');
      console.error('   1. Go to https://cloud.mongodb.com');
      console.error('   2. Navigate to Network Access (Security → Network Access)');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Add Current IP Address" or add 0.0.0.0/0 for all IPs (development only)');
      console.error('   5. Wait 1-2 minutes for changes to propagate');
    } else if (error.message.includes('authentication')) {
      console.error('\n🔧 Fix: Check your MongoDB credentials in .env.local');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.error('\n🔧 Fix: Check your internet connection and MongoDB Atlas cluster status');
    }
    
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

testConnection();

