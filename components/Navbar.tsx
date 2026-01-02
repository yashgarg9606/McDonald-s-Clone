'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { toast } from 'react-toastify';
import api from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const { items, getItemCount } = useCartStore();
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const itemCount = getItemCount();

  const handleLogout = async () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <nav className="bg-mcdonalds-red dark:bg-mcdonalds-dark-red text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span 
              className="text-5xl text-mcdonalds-yellow" 
              style={{ 
                fontFamily: 'var(--font-fredoka), Fredoka, sans-serif', 
                letterSpacing: '-0.04em',
                fontWeight: 500
              }}
            >
              M
            </span>
            <span className="text-xl font-bold">McDonald&apos;s</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-mcdonalds-yellow transition-colors"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="hover:text-mcdonalds-yellow transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/deals"
              className="hover:text-mcdonalds-yellow transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/stores"
              className="hover:text-mcdonalds-yellow transition-colors"
            >
              Find Stores
            </Link>
            {isAuthenticated() && (
              <Link
                href="/orders"
                className="hover:text-mcdonalds-yellow transition-colors"
              >
                Orders
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              🛒
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-mcdonalds-yellow text-mcdonalds-red rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
                >
                  <span>👤</span>
                  <span>{user?.name}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-mcdonalds-yellow text-mcdonalds-red rounded-full hover:bg-yellow-400 transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <Link
              href="/"
              className="block py-2 hover:text-mcdonalds-yellow"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="block py-2 hover:text-mcdonalds-yellow"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/deals"
              className="block py-2 hover:text-mcdonalds-yellow"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
            <Link
              href="/stores"
              className="block py-2 hover:text-mcdonalds-yellow"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Stores
            </Link>
            {isAuthenticated() && (
              <Link
                href="/orders"
                className="block py-2 hover:text-mcdonalds-yellow"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
            )}
            <Link
              href="/cart"
              className="block py-2 hover:text-mcdonalds-yellow"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart ({itemCount})
            </Link>
            <button
              onClick={toggleDarkMode}
              className="block py-2 hover:text-mcdonalds-yellow w-full text-left"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                className="block py-2 hover:text-mcdonalds-yellow w-full text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 hover:text-mcdonalds-yellow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block py-2 hover:text-mcdonalds-yellow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

