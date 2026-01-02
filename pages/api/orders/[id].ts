import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { authenticate, AuthRequest } from '@/lib/auth';

export default async function handler(
  req: AuthRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return authenticate(req, res, async () => {
    try {
      await connectDB();

      const { id } = req.query;

      const order = await Order.findOne({ _id: id, user: req.user?.id }).populate('items.product');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(200).json({ order });
    } catch (error: any) {
      console.error('Get order error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
}

