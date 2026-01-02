'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from './Layout';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'burgers' | 'fries' | 'beverages' | 'desserts';
}

const categories = [
  { id: 'all', name: 'All Items', icon: '📋' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'fries', name: 'Fries & Sides', icon: '🍟' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍦' },
];

export default function MenuPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?available=true');
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load menu';
      if (errorMessage.includes('whitelist') || errorMessage.includes('IP')) {
        toast.error('Database connection issue. Please check MongoDB Atlas IP whitelist settings.');
      } else {
        toast.error('Failed to load menu. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Removed handleAddToCart - users should go to product detail page first

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Our Menu
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                selectedCategory === category.id
                  ? 'bg-mcdonalds-red text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No products found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div
                    className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center cursor-pointer relative overflow-hidden"
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600" style={{ display: product.image ? 'none' : 'flex' }}>
                      <span className="text-6xl">
                        {product.category === 'desserts' ? '🥧' : product.category === 'beverages' ? '🥤' : product.category === 'fries' ? '🍟' : '🍔'}
                      </span>
                    </div>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

