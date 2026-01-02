import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import User from '@/models/User';
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

      const user = await User.findById(req.user?.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
        },
      });
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
}

