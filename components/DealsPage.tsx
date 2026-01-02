'use client';

import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Deal {
  _id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validUntil: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await api.get('/deals');
      setDeals(response.data.deals);
    } catch (error) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Special Deals & Offers
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-lg" />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No deals available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <motion.div
                key={deal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-mcdonalds-red to-mcdonalds-dark-red text-white rounded-lg shadow-lg p-6"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2">{deal.name}</h3>
                  <p className="text-white/90">{deal.description}</p>
                </div>

                <div className="mb-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Discount</span>
                    <span className="text-2xl font-bold">
                      {deal.discountType === 'percentage'
                        ? `${deal.discountValue}%`
                        : `₹${deal.discountValue}`}
                    </span>
                  </div>
                  {deal.minOrderAmount && (
                    <p className="text-xs text-white/80">
                      Min. order: ₹{deal.minOrderAmount}
                    </p>
                  )}
                  {deal.maxDiscountAmount && (
                    <p className="text-xs text-white/80">
                      Max. discount: ₹{deal.maxDiscountAmount}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-white/80 mb-2">Coupon Code</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white text-mcdonalds-red px-4 py-2 rounded font-bold text-center">
                      {deal.code}
                    </div>
                    <button
                      onClick={() => copyCode(deal.code)}
                      className="bg-mcdonalds-yellow text-mcdonalds-red px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <p className="text-xs text-white/70">
                  Valid until: {new Date(deal.validUntil).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

