import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Deal from '@/models/Deal';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const deal = await Deal.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });

    if (!deal) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    if (deal.usageLimit && deal.usedCount >= deal.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    if (deal.minOrderAmount && orderAmount < deal.minOrderAmount) {
      return res.status(400).json({
        error: `Minimum order amount of ₹${deal.minOrderAmount} required`,
      });
    }

    let discount = 0;
    if (deal.discountType === 'percentage') {
      discount = (orderAmount * deal.discountValue) / 100;
      if (deal.maxDiscountAmount) {
        discount = Math.min(discount, deal.maxDiscountAmount);
      }
    } else {
      discount = Math.min(deal.discountValue, orderAmount);
    }

    res.status(200).json({
      valid: true,
      deal: {
        code: deal.code,
        name: deal.name,
        description: deal.description,
        discountType: deal.discountType,
        discountValue: deal.discountValue,
        discount,
      },
    });
  } catch (error: any) {
    console.error('Validate deal error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

