'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from './Layout';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products?available=true');
      setFeaturedProducts(response.data.products.slice(0, 6));
    } catch (error: any) {
      console.error('Error fetching products:', error);
      // Show user-friendly error message
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load products';
      if (errorMessage.includes('whitelist') || errorMessage.includes('IP')) {
        console.error('Database connection issue: Please whitelist your IP in MongoDB Atlas');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Banner with Burger Image and M Logo */}
      <section className="relative bg-gradient-to-r from-mcdonalds-red to-mcdonalds-dark-red text-white overflow-hidden">
        {/* McDonald's M Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[400px] md:text-[600px] font-black text-mcdonalds-yellow"
            style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1 }}
          >
            M
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
                I&apos;m Lovin&apos; It
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Order your favorite meals online and get them delivered to your door
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/menu"
                  className="bg-mcdonalds-yellow text-mcdonalds-red px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg"
                >
                  Order Now
                </Link>
                <Link
                  href="/menu"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all border-2 border-white transform hover:scale-105"
                >
                  View Menu
                </Link>
              </div>
            </motion.div>

            {/* Right Side - Burger Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end relative"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop"
                    alt="Delicious Burger"
                    width={600}
                    height={600}
                    className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    priority
                  />
                </motion.div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-mcdonalds-yellow rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-white rounded-full opacity-20 blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Compact Promotional Offers */}
      <section className="py-6 bg-mcdonalds-yellow dark:bg-yellow-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-mcdonalds-red mb-1">
                Special Offers
              </h2>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                Get amazing deals on your favorite meals
              </p>
            </div>
            <Link
              href="/deals"
              className="bg-mcdonalds-red text-white px-6 py-2 rounded-full font-bold hover:bg-mcdonalds-dark-red transition-all transform hover:scale-105 shadow-md whitespace-nowrap"
            >
              View All Deals →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Meals */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Meals
            </h2>
            <div className="w-24 h-1 bg-mcdonalds-yellow mx-auto rounded-full"></div>
          </motion.div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center relative overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <span className="text-6xl">
                            {product.category === 'desserts' ? '🥧' : product.category === 'beverages' ? '🥤' : product.category === 'fries' ? '🍟' : '🍔'}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-mcdonalds-red">
                            ₹{product.price}
                          </span>
                          <Link
                            href={`/products/${product._id}`}
                            className="bg-mcdonalds-yellow text-mcdonalds-red px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors inline-block text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Add to Cart
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Order?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Browse our menu and place your order today
            </p>
            <Link
              href="/menu"
              className="inline-block bg-mcdonalds-red text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-mcdonalds-dark-red transition-all transform hover:scale-110 shadow-xl"
            >
              Browse Menu →
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

