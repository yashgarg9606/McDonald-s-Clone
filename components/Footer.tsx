'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-mcdonalds-yellow">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-mcdonalds-yellow">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-mcdonalds-yellow">
                  News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-mcdonalds-yellow">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-mcdonalds-yellow">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-mcdonalds-yellow">
                  Find Stores
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-mcdonalds-yellow">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-mcdonalds-yellow">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-mcdonalds-yellow">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-mcdonalds-yellow" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="hover:text-mcdonalds-yellow" aria-label="Twitter">
                🐦
              </a>
              <a href="#" className="hover:text-mcdonalds-yellow" aria-label="Instagram">
                📷
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2024 McDonald&apos;s Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

