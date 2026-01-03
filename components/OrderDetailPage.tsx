'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './Layout';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  customization?: any;
}

interface Order {
  _id: string;
  items: OrderItem[];
  orderType: 'delivery' | 'takeaway';
  deliveryAddress?: any;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  couponCode?: string;
  createdAt: string;
}

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (error: any) {
      toast.error('Order not found');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchOrder();
  }, [orderId, isAuthenticated, fetchOrder, router]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      ready: 'bg-green-500',
      delivered: 'bg-green-600',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="skeleton h-96 rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-mcdonalds-red hover:underline"
        >
          ← Back to Orders
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Order Details</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Type: {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Payment: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Payment Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
              </div>

              {order.deliveryAddress && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Delivery Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.deliveryAddress.street}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                    {order.deliveryAddress.zipCode}
                  </p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Landmark: {order.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-300 dark:border-gray-600 pt-6 mb-6">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-gray-200 dark:border-gray-600 pb-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.name} x {item.quantity}
                      </p>
                      {item.customization && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.customization.size && (
                            <span>Size: {item.customization.size}</span>
                          )}
                          {item.customization.addedIngredients &&
                            item.customization.addedIngredients.length > 0 && (
                              <span className="ml-2">
                                Added: {item.customization.addedIngredients.join(', ')}
                              </span>
                            )}
                          {item.customization.removedIngredients &&
                            item.customization.removedIngredients.length > 0 && (
                              <span className="ml-2">
                                Removed: {item.customization.removedIngredients.join(', ')}
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (5%)</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span>Total</span>
                  <span className="text-mcdonalds-red">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

