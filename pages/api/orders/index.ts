import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Deal from '@/models/Deal';
import { authenticate, AuthRequest } from '@/lib/auth';

export default async function handler(
  req: AuthRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return authenticate(req, res, async () => {
      try {
        await connectDB();

        const {
          items,
          orderType,
          deliveryAddress,
          paymentMethod,
          couponCode,
        } = req.body;

        if (!items || items.length === 0) {
          return res.status(400).json({ error: 'Order items are required' });
        }

        // Calculate subtotal
        const subtotal = items.reduce((sum: number, item: any) => {
          return sum + item.price * item.quantity;
        }, 0);

        // Apply coupon if provided
        let discount = 0;
        let appliedCoupon = null;
        if (couponCode) {
          const deal = await Deal.findOne({
            code: couponCode.toUpperCase(),
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() },
          });

          if (deal) {
            if (!deal.usageLimit || deal.usedCount < deal.usageLimit) {
              if (!deal.minOrderAmount || subtotal >= deal.minOrderAmount) {
                if (deal.discountType === 'percentage') {
                  discount = (subtotal * deal.discountValue) / 100;
                  if (deal.maxDiscountAmount) {
                    discount = Math.min(discount, deal.maxDiscountAmount);
                  }
                } else {
                  discount = deal.discountValue;
                }
                appliedCoupon = deal.code;
              }
            }
          }
        }

        // Calculate tax (assume 5% GST)
        const tax = (subtotal - discount) * 0.05;
        const total = subtotal - discount + tax;

        // Create order with confirmed status (since this is a mock payment system)
        const order = new Order({
          user: req.user?.id,
          items,
          orderType,
          deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
          subtotal,
          tax,
          discount,
          total,
          paymentMethod,
          couponCode: appliedCoupon,
          status: 'confirmed', // Automatically confirm orders in mock system
          paymentStatus: 'completed', // Mark payment as completed since it's mock
        });

        await order.save();

        // Update deal usage count if coupon was applied
        if (appliedCoupon) {
          await Deal.updateOne({ code: appliedCoupon }, { $inc: { usedCount: 1 } });
        }

        res.status(201).json({
          message: 'Order created successfully',
          order,
        });
      } catch (error: any) {
        console.error('Create order error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    });
  } else if (req.method === 'GET') {
    return authenticate(req, res, async () => {
      try {
        await connectDB();

        const orders = await Order.find({ user: req.user?.id })
          .sort({ createdAt: -1 })
          .populate('items.product');

        res.status(200).json({ orders });
      } catch (error: any) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

