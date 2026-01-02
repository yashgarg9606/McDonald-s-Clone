import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db';
import Product from '../models/Product';
import Deal from '../models/Deal';
import Store from '../models/Store';

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
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    isActive: true,
  },
  {
    code: 'FLAT50',
    name: 'Flat ₹50 Off',
    description: 'Get flat ₹50 off on orders above ₹300',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 300,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    isActive: true,
  },
  {
    code: 'BURGER30',
    name: 'Burger Special',
    description: 'Get 30% off on all burgers',
    discountType: 'percentage',
    discountValue: 30,
    applicableCategories: ['burgers'],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    isActive: true,
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
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data
    await Product.deleteMany({});
    await Deal.deleteMany({});
    await Store.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Seed products
    const productResult = await Product.insertMany(products);
    console.log(`✅ Seeded ${productResult.length} products`);

    // Seed deals
    const dealResult = await Deal.insertMany(deals);
    console.log(`✅ Seeded ${dealResult.length} deals`);

    // Seed stores
    const storeResult = await Store.insertMany(stores);
    console.log(`✅ Seeded ${storeResult.length} stores`);

    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding error:', error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    console.error(error);
    process.exit(1);
  }
}

seed();

