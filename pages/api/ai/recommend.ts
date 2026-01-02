import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { optionalAuth, AuthRequest } from '@/lib/auth';

export default async function handler(
  req: AuthRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return optionalAuth(req, res, async () => {
    try {
      await connectDB();

      const { budget, preferences, pastOrders } = req.body;

      let products = await Product.find({ available: true });

      // Filter by budget if provided
      if (budget) {
        products = products.filter((p) => p.price <= budget);
      }

      // If user is authenticated, use past orders for recommendations
      if (req.user && pastOrders !== false) {
        const userOrders = await Order.find({ user: req.user.id })
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('items.product');

        const categoryFrequency: Record<string, number> = {};
        userOrders.forEach((order) => {
          order.items.forEach((item: any) => {
            if (item.product && item.product.category) {
              categoryFrequency[item.product.category] =
                (categoryFrequency[item.product.category] || 0) + item.quantity;
            }
          });
        });

        // Boost products from frequently ordered categories
        products = products.sort((a, b) => {
          const freqA = categoryFrequency[a.category] || 0;
          const freqB = categoryFrequency[b.category] || 0;
          return freqB - freqA;
        });
      }

      // Filter by preferences
      if (preferences) {
        if (preferences.spicy) {
          products = products.filter((p) =>
            p.name.toLowerCase().includes('spicy') ||
            p.description.toLowerCase().includes('spicy')
          );
        }
        if (preferences.vegetarian) {
          products = products.filter((p) =>
            !p.name.toLowerCase().includes('chicken') &&
            !p.name.toLowerCase().includes('beef') &&
            !p.name.toLowerCase().includes('meat')
          );
        }
        if (preferences.category) {
          products = products.filter((p) => p.category === preferences.category);
        }
      }

      // Limit to 10 recommendations
      products = products.slice(0, 10);

      res.status(200).json({ recommendations: products });
    } catch (error: any) {
      console.error('AI recommend error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
}

