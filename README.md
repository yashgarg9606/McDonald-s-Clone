# 🍔 McDonald's Clone - Full-Stack Web Application

A production-quality full-stack web application clone of McDonald's customer-facing website with online food ordering capabilities.

## 🚀 Features

### Basic Features
- ✅ Homepage with hero banners and promotional offers
- ✅ Category-based menu browsing (Burgers, Fries, Beverages, Desserts)
- ✅ Product detail pages with customization options
- ✅ Shopping cart with persistent state
- ✅ Fully responsive design

### Intermediate Features
- ✅ User authentication (Signup/Login)
- ✅ Guest checkout support
- ✅ Complete order flow (Delivery/Takeaway)
- ✅ Coupon code system with validation
- ✅ Store locator with search functionality

### AI Features
- ✅ AI Meal Recommendation based on budget and preferences
- ✅ Nutrition-based filtering
- ✅ AI Chatbot for conversational ordering

### UI/UX Features
- ✅ McDonald's inspired color palette (Red/Yellow/White)
- ✅ Smooth animations and transitions
- ✅ Skeleton loaders for better UX
- ✅ Toast notifications
- ✅ Keyboard navigation and ARIA labels

### Bonus Features
- ✅ Dark mode with preference persistence
- ✅ Order history with re-order functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Node.js, Express patterns
- **Database**: MongoDB with Mongoose
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Emoji-based (can be replaced with icon library)


## 📁 Project Structure

```
McD/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── menu/              # Menu page
│   ├── products/[id]/     # Product detail page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout page
│   ├── orders/            # Order history
│   ├── orders/[id]/       # Order detail
│   ├── deals/             # Deals page
│   ├── stores/            # Store locator
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrdersPage.tsx
│   ├── OrderDetailPage.tsx
│   ├── DealsPage.tsx
│   ├── StoresPage.tsx
│   ├── AIChatbot.tsx
│   └── ...
├── pages/api/             # API routes
│   ├── auth/              # Authentication endpoints
│   ├── products/          # Product endpoints
│   ├── orders/            # Order endpoints
│   ├── deals/             # Deal endpoints
│   ├── stores/            # Store endpoints
│   └── ai/                # AI endpoints
├── models/                # MongoDB models
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   ├── Deal.ts
│   └── Store.ts
├── store/                 # Zustand stores
│   ├── cartStore.ts
│   ├── authStore.ts
│   └── themeStore.ts
├── lib/                   # Utility functions
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication utilities
│   └── api.ts            # API client
└── scripts/              # Utility scripts
    └── seed.ts           # Database seeder
```

## 🔐 Authentication

The application supports:
- User registration with email and password
- User login with JWT tokens
- Guest checkout (no account required)
- Protected routes for authenticated users

### Default Test Accounts

After seeding, you can create test accounts through the signup page.

## 🛒 Shopping Flow

1. Browse menu items by category
2. View product details and customize (if available)
3. Add items to cart
4. Review cart and proceed to checkout
5. Choose delivery or takeaway
6. Enter delivery address (if needed)
7. Apply coupon code (optional)
8. Select payment method
9. Place order
10. View order confirmation

## 🤖 AI Features Usage

### Meal Recommendation
- Ask the chatbot: "Suggest a meal under ₹200"
- Use the recommendation API with budget and preferences

### Nutrition Filtering
- Filter products by calories, protein, carbs, fat
- Access via API: `/api/ai/nutrition?maxCalories=300`

### Chatbot
- Click the chatbot button (bottom right)
- Ask questions like:
  - "I want something spicy"
  - "Show me vegetarian options"
  - "Suggest a meal under ₹200"

## 🎨 Dark Mode

Toggle dark mode using the button in the navigation bar. Your preference is automatically saved and persists across sessions.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with optional category filter)
- `GET /api/products/[id]` - Get product details

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/[id]` - Get order details (protected)

### Deals
- `GET /api/deals` - Get all active deals
- `POST /api/deals/validate` - Validate coupon code

### Stores
- `GET /api/stores` - Get stores (with optional city/zipCode filter)

### AI
- `POST /api/ai/recommend` - Get meal recommendations
- `GET /api/ai/nutrition` - Filter products by nutrition
- `POST /api/ai/chatbot` - Chatbot endpoint

## 🚧 Development Notes

- All payments are mocked (no real payment processing)
- Images use placeholder URLs (replace with actual product images)
- MongoDB connection uses connection pooling for better performance
- Cart state persists in localStorage
- Authentication tokens stored in localStorage

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` (or check MongoDB Atlas connection)
- Verify MONGODB_URI in `.env.local`

### Build Errors
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check TypeScript errors: `npm run lint`

### Port Already in Use
- Change port: `PORT=3001 npm run dev`

## 📦 Production Build

```bash
npm run build
npm start
```

## 🤝 Contributing

This is a clone project for educational purposes. Feel free to fork and customize for your needs.

## 📄 License

This project is for educational purposes only. McDonald's is a trademark of McDonald's Corporation.

## 🙏 Acknowledgments

- Inspired by McDonald's official website
- Built with modern web technologies and best practices

---

**Note**: This is a demo application. No real payments are processed, and no actual orders are fulfilled.

