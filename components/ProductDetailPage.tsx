'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from './Layout';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  customizable: boolean;
  ingredients?: string[];
  available: boolean;
}

export default function ProductDetailPage({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string>('regular');
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const { addItem } = useCartStore();

  // Calculate price based on size
  const getCurrentPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    switch (size) {
      case 'small':
        return Math.round(basePrice * 0.85); // 15% discount for small
      case 'regular':
        return basePrice; // Base price
      case 'large':
        return Math.round(basePrice * 1.15); // 15% increase for large
      default:
        return basePrice;
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      router.push('/menu');
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!product) return;

    const currentPrice = getCurrentPrice();
    const customization = product.customizable
      ? {
          size,
          addedIngredients: addedIngredients.length > 0 ? addedIngredients : undefined,
          removedIngredients: removedIngredients.length > 0 ? removedIngredients : undefined,
        }
      : undefined;

    for (let i = 0; i < quantity; i++) {
      addItem({
        product: product._id,
        name: product.name,
        image: product.image,
        price: currentPrice, // Use dynamic price based on size
        quantity: 1,
        customization,
      });
    }

    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const toggleIngredient = (ingredient: string) => {
    // If ingredient is currently removed, add it back (remove from removed list)
    if (removedIngredients.includes(ingredient)) {
      setRemovedIngredients((prev) => prev.filter((i) => i !== ingredient));
    } else {
      // If ingredient is present, remove it (add to removed list)
      setRemovedIngredients((prev) => [...prev, ingredient]);
      // Also remove from added list if it was there
      setAddedIngredients((prev) => prev.filter((i) => i !== ingredient));
    }
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

  if (!product) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Product Image */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 dark:bg-gray-600 flex items-center justify-center relative overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <span className="text-9xl">🍔</span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            <div className="mb-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-mcdonalds-red">₹{getCurrentPrice()}</p>
                {size !== 'regular' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {size === 'small' ? '15% off' : '15% larger'} from regular size
                  </p>
                )}
              </div>

              {/* Nutrition Info */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Nutrition Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Calories:</span>{' '}
                    <span className="font-semibold">{product.nutrition.calories}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Protein:</span>{' '}
                    <span className="font-semibold">{product.nutrition.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Carbs:</span>{' '}
                    <span className="font-semibold">{product.nutrition.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Fat:</span>{' '}
                    <span className="font-semibold">{product.nutrition.fat}g</span>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              {product.customizable && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Customize</h3>

                  {/* Size Selection */}
                  <div className="mb-4">
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">Size</label>
                    <div className="flex gap-2">
                      {['small', 'regular', 'large'].map((s) => {
                        const sizePrice = s === 'small' 
                          ? Math.round(product.price * 0.85)
                          : s === 'large'
                          ? Math.round(product.price * 1.15)
                          : product.price;
                        return (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={`px-4 py-2 rounded flex flex-col items-center ${
                              size === s
                                ? 'bg-mcdonalds-red text-white'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                            <span className="text-xs mt-1">₹{sizePrice}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ingredients */}
                  {product.ingredients && product.ingredients.length > 0 && (
                    <div>
                      <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        Ingredients
                      </label>
                      <div className="space-y-2">
                        {product.ingredients.map((ingredient) => {
                          const isRemoved = removedIngredients.includes(ingredient);
                          return (
                            <div key={ingredient} className="flex items-center gap-4">
                              <span className="flex-1 text-gray-700 dark:text-gray-300">
                                {ingredient}
                                {isRemoved && (
                                  <span className="ml-2 text-xs text-red-500">(Removed)</span>
                                )}
                              </span>
                              <button
                                onClick={() => toggleIngredient(ingredient)}
                                className={`px-4 py-1 rounded text-sm font-semibold transition-colors ${
                                  isRemoved
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                              >
                                {isRemoved ? 'Add' : 'Remove'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700 dark:text-gray-300">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.available}
                className={`w-full py-3 rounded-full font-bold text-lg ${
                  product.available
                    ? 'bg-mcdonalds-yellow text-mcdonalds-red hover:bg-yellow-400'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                } transition-colors`}
              >
                {product.available ? 'Add to Cart' : 'Not Available'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

