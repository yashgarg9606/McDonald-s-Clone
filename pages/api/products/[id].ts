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

    const { id } = req.query;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

