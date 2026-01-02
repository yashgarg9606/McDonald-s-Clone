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
  // Check if database name is in the URI path
  const pathMatch = uri.match(/\/([^?\/]+)(\?|$)/);
  if (pathMatch && pathMatch[1] && pathMatch[1] !== 'test' && !pathMatch[1].includes('@')) {
    return pathMatch[1];
  }
  // Otherwise use the default database name
  return DB_NAME;
}

const DATABASE_NAME = getDatabaseName(MONGODB_URI);

const products = [
  {
    name: 'Big Mac',
    description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun',
    category: 'burgers',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    nutrition: {
      calories: 550,
      protein: 25,
      carbs: 45,
      fat: 33,
      fiber: 3,
    },
    customizable: true,
    ingredients: ['Beef Patty', 'Lettuce', 'Cheese', 'Pickles', 'Onions', 'Special Sauce'],
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'McChicken',
    description: 'Crispy chicken patty with mayonnaise and lettuce',
    category: 'burgers',
    price: 149,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
    nutrition: {
      calories: 350,
      protein: 14,
      carbs: 35,
      fat: 16,
      fiber: 2,
    },
    customizable: true,
    ingredients: ['Chicken Patty', 'Lettuce', 'Mayonnaise'],
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Veggie Burger',
    description: 'Delicious veggie patty with fresh vegetables',
    category: 'burgers',
    price: 129,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 42,
      fat: 10,
      fiber: 5,
    },
    customizable: true,
    ingredients: ['Veggie Patty', 'Lettuce', 'Tomato', 'Onions', 'Mayonnaise'],
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'French Fries',
    description: 'Golden crispy French fries',
    category: 'fries',
    price: 79,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    nutrition: {
      calories: 230,
      protein: 3,
      carbs: 30,
      fat: 11,
      fiber: 3,
    },
    customizable: false,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Chicken Nuggets (6 pc)',
    description: 'Crispy chicken nuggets',
    category: 'fries',
    price: 149,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    nutrition: {
      calories: 280,
      protein: 15,
      carbs: 16,
      fat: 17,
      fiber: 1,
    },
    customizable: false,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Coca Cola',
    description: 'Refreshing Coca Cola',
    category: 'beverages',
    price: 59,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    nutrition: {
      calories: 150,
      protein: 0,
      carbs: 39,
      fat: 0,
      fiber: 0,
    },
    customizable: false,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Orange Juice',
    description: 'Fresh orange juice',
    category: 'beverages',
    price: 69,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    nutrition: {
      calories: 110,
      protein: 2,
      carbs: 26,
      fat: 0,
      fiber: 0,
    },
    customizable: false,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'McFlurry',
    description: 'Creamy soft serve ice cream with your favorite toppings',
    category: 'desserts',
    price: 99,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    nutrition: {
      calories: 330,
      protein: 7,
      carbs: 45,
      fat: 13,
      fiber: 1,
    },
    customizable: true,
    ingredients: ['Ice Cream', 'Oreo Cookies', 'Caramel Sauce'],
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Apple Pie',
    description: 'Warm apple pie',
    category: 'desserts',
    price: 79,
    image: 'https://images.unsplash.com/photo-1621863007151-99e3e0f6e7c5?w=600&h=600&fit=crop',
    nutrition: {
      calories: 250,
      protein: 2,
      carbs: 32,
      fat: 13,
      fiber: 2,
    },
    customizable: false,
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const deals = [
  {
    code: 'WELCOME20',
    name: 'Welcome Offer',
    description: 'Get 20% off on your first order',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 200,
    maxDiscountAmount: 100,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usedCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    code: 'FLAT50',
    name: 'Flat ₹50 Off',
    description: 'Get flat ₹50 off on orders above ₹300',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 300,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usedCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    code: 'BURGER30',
    name: 'Burger Special',
    description: 'Get 30% off on all burgers',
    discountType: 'percentage',
    discountValue: 30,
    applicableCategories: ['burgers'],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usedCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const stores = [
  {
    name: 'McDonald\'s Downtown',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      landmark: 'Near Central Station',
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
    },
    phone: '+91 22 1234 5678',
    email: 'downtown@mcdonalds.com',
    timing: {
      open: '07:00',
      close: '23:00',
    },
    daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    isOpen: true,
    services: {
      dineIn: true,
      takeaway: true,
      delivery: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'McDonald\'s Mall Location',
    address: {
      street: '456 Shopping Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400052',
      landmark: 'Inside City Mall',
    },
    location: {
      latitude: 19.1334,
      longitude: 72.8267,
    },
    phone: '+91 22 2345 6789',
    email: 'mall@mcdonalds.com',
    timing: {
      open: '10:00',
      close: '22:00',
    },
    daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    isOpen: true,
    services: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'McDonald\'s Airport',
    address: {
      street: 'Terminal 2',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400099',
      landmark: 'Domestic Terminal',
    },
    location: {
      latitude: 19.0896,
      longitude: 72.8656,
    },
    phone: '+91 22 3456 7890',
    timing: {
      open: '00:00',
      close: '23:59',
    },
    daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    isOpen: true,
    services: {
      dineIn: true,
      takeaway: true,
      delivery: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    console.log(`✅ Connected to MongoDB`);
    console.log(`📦 Using database: ${DATABASE_NAME}`);

    const db = client.db(DATABASE_NAME);

    // Clear existing collections
    await db.collection('products').deleteMany({});
    await db.collection('deals').deleteMany({});
    await db.collection('stores').deleteMany({});
    console.log('🧹 Cleared existing data');

    // Insert data
    const productResult = await db.collection('products').insertMany(products);
    console.log(`✅ Inserted ${productResult.insertedCount} products`);

    const dealResult = await db.collection('deals').insertMany(deals);
    console.log(`✅ Inserted ${dealResult.insertedCount} deals`);

    const storeResult = await db.collection('stores').insertMany(stores);
    console.log(`✅ Inserted ${storeResult.insertedCount} stores`);

    // Verify
    const productCount = await db.collection('products').countDocuments();
    const dealCount = await db.collection('deals').countDocuments();
    const storeCount = await db.collection('stores').countDocuments();

    console.log('\n📊 Verification:');
    console.log(`  Products: ${productCount}`);
    console.log(`  Deals: ${dealCount}`);
    console.log(`  Stores: ${storeCount}`);

    console.log('\n🎉 Seeding completed successfully!');
  } catch (error: any) {
    console.error('❌ Seeding error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();

