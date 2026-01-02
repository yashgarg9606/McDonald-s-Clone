'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './Layout';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;

  // Redirect if not authenticated or cart is empty
  if (typeof window !== 'undefined' && (!isAuthenticated() || items.length === 0)) {
    if (items.length === 0) {
      router.push('/cart');
    } else {
      router.push('/login?redirect=/checkout');
    }
    return null;
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const response = await api.post('/deals/validate', {
        code: couponCode,
        orderAmount: subtotal,
      });
      setDiscount(response.data.deal.discount);
      toast.success('Coupon applied successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid coupon code');
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode)) {
      toast.error('Please fill in all required delivery address fields');
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
      }));

      const response = await api.post('/orders', {
        items: orderItems,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        couponCode: discount > 0 ? couponCode : undefined,
      });

      clearCart();
      toast.success('Order placed successfully');
      router.push(`/orders/${response.data.order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Order Type
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    orderType === 'delivery'
                      ? 'bg-mcdonalds-red text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    orderType === 'takeaway'
                      ? 'bg-mcdonalds-red text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Takeaway
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">City *</label>
                      <input
                        type="text"
                        value={deliveryAddress.city}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">State *</label>
                      <input
                        type="text"
                        value={deliveryAddress.state}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.zipCode}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.landmark}
                        onChange={(e) =>
                          setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Payment Method
              </h2>
              <div className="space-y-2">
                {['card', 'upi', 'cash'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as 'card' | 'upi' | 'cash')}
                    className={`w-full py-3 px-4 rounded-lg text-left font-semibold ${
                      paymentMethod === method
                        ? 'bg-mcdonalds-red text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                * This is a demo. No actual payment will be processed.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              {/* Coupon Code */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-mcdonalds-yellow text-mcdonalds-red px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.product}
                    className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4 border-t border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span>Total</span>
                  <span className="text-mcdonalds-red">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-mcdonalds-yellow text-mcdonalds-red py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

