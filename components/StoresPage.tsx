'use client';

import { useEffect, useState } from 'react';
import Layout from './Layout';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Store {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
  };
  phone: string;
  timing: {
    open: string;
    close: string;
  };
  services: {
    dineIn: boolean;
    takeaway: boolean;
    delivery: boolean;
  };
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchZip, setSearchZip] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const params: any = {};
      if (searchCity) params.city = searchCity;
      if (searchZip) params.zipCode = searchZip;

      const response = await api.get('/stores', { params });
      setStores(response.data.stores);
    } catch (error) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchStores();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Find Stores Near You
        </h1>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">City</label>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">ZIP Code</label>
              <input
                type="text"
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                placeholder="Enter ZIP code"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mcdonalds-red bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-full bg-mcdonalds-red text-white py-3 rounded-full font-bold hover:bg-mcdonalds-dark-red transition-colors"
          >
            Search Stores
          </button>
        </div>

        {/* Stores List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-lg" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No stores found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={store._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {store.name}
                </h3>

                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{store.address.street}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    {store.address.city}, {store.address.state} {store.address.zipCode}
                  </p>
                  {store.address.landmark && (
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      Landmark: {store.address.landmark}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Phone:</span> {store.phone}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Hours:</span> {store.timing.open} - {store.timing.close}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {store.services.dineIn && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      Dine-In
                    </span>
                  )}
                  {store.services.takeaway && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      Takeaway
                    </span>
                  )}
                  {store.services.delivery && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                      Delivery
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

