import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { maxCalories, maxFat, highProtein, lowCarbs } = req.query;

    let products = await Product.find({ available: true });

    // Filter by nutrition criteria
    if (maxCalories) {
      const max = parseInt(maxCalories as string);
      products = products.filter((p) => p.nutrition.calories <= max);
    }

    if (maxFat) {
      const max = parseInt(maxFat as string);
      products = products.filter((p) => p.nutrition.fat <= max);
    }

    if (highProtein === 'true') {
      // Sort by protein content (descending)
      products = products.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
    }

    if (lowCarbs === 'true') {
      // Sort by carbs content (ascending)
      products = products.sort((a, b) => a.nutrition.carbs - b.nutrition.carbs);
    }

    res.status(200).json({ products });
  } catch (error: any) {
    console.error('Nutrition filter error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

