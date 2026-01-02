'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './Layout';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  customization?: {
    size?: string;
    addedIngredients?: string[];
    removedIngredients?: string[];
  };
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
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login?redirect=/orders');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    } catch (error: any) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReOrder = async (order: Order) => {
    // This would add items to cart - for now just redirect to menu
    toast.info('Please add items to cart manually');
    router.push('/menu');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-green-500', // Changed to green for confirmed
      preparing: 'bg-purple-500',
      ready: 'bg-blue-500',
      delivered: 'bg-green-600',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="skeleton h-64 rounded-lg" />
        </div>
      </Layout>
    );
  }

  // If not authenticated, don't render (redirect will happen)
  if (!isAuthenticated()) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="skeleton h-64 rounded-lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              No orders yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start ordering to see your order history here
            </p>
            <Link
              href="/menu"
              className="inline-block bg-mcdonalds-red text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-mcdonalds-dark-red transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} •{' '}
                      {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                    </p>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</p>
                    <button
                      onClick={() => handleReOrder(order)}
                      className="mt-2 text-mcdonalds-red hover:underline"
                    >
                      Re-order
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Items:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => {
                      const size = item.customization?.size || 'Regular';
                      const hasCustomization = item.customization && (
                        (item.customization.addedIngredients?.length ?? 0) > 0 ||
                        (item.customization.removedIngredients?.length ?? 0) > 0
                      );
                      
                      return (
                        <li key={idx} className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="text-gray-600 dark:text-gray-400">
                              {item.name} x {item.quantity}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 ml-0">
                              <span className="block">Size: {size.charAt(0).toUpperCase() + size.slice(1)}</span>
                              {hasCustomization && (
                                <>
                                  {item.customization?.addedIngredients &&
                                    item.customization.addedIngredients.length > 0 && (
                                      <span className="block text-green-600 dark:text-green-400">
                                        Added: {item.customization.addedIngredients.join(', ')}
                                      </span>
                                    )}
                                  {item.customization?.removedIngredients &&
                                    item.customization.removedIngredients.length > 0 && (
                                      <span className="block text-red-600 dark:text-red-400">
                                        Removed: {item.customization.removedIngredients.join(', ')}
                                      </span>
                                    )}
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 ml-4">₹{item.price * item.quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 flex justify-between text-sm">
                    <Link
                      href={`/orders/${order._id}`}
                      className="text-mcdonalds-red hover:underline"
                    >
                      View Details
                    </Link>
                    {order.discount > 0 && (
                      <span className="text-green-600 dark:text-green-400">
                        Discount: -₹{order.discount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

