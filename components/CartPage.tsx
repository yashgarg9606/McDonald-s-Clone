'use client';

import { useRouter } from 'next/navigation';
import Layout from './Layout';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const subtotal = getTotal();
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (isAuthenticated()) {
      router.push('/checkout');
    } else {
      toast.info('Please login to continue');
      router.push('/login?redirect=/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add some delicious items to get started
          </p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-mcdonalds-red text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-mcdonalds-dark-red transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id || `${item.product}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 flex gap-4"
              >
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-3xl">🍔</span>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  {item.customization && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
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
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-mcdonalds-red">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast.success('Item removed from cart');
                        }}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span className="text-mcdonalds-red">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-mcdonalds-yellow text-mcdonalds-red py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => router.push('/menu')}
                className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

