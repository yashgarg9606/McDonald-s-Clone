import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Deal from '@/models/Deal';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const now = new Date();
    const deals = await Deal.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    }).sort({ createdAt: -1 });

    res.status(200).json({ deals });
  } catch (error: any) {
    console.error('Get deals error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

