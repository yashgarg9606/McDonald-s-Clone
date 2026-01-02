# 🚀 Deployment Guide

Complete guide to deploy your McDonald's Clone application to production.

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] ✅ All dependencies installed (`npm install`)
- [x] ✅ Database connection working (MongoDB Atlas configured)
- [x] ✅ Environment variables set up
- [x] ✅ Database seeded with initial data
- [x] ✅ Application builds successfully (`npm run build`)
- [x] ✅ No TypeScript errors (`npm run lint`)
- [x] ✅ Groq API key configured (optional, for AI features)

## 📋 Required Environment Variables

You'll need to set these in your hosting platform:

### Required Variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mcdonalds-clone
JWT_SECRET=your-strong-secret-key-min-32-characters
```

### Optional Variables:
```env
GROQ_API_KEY=your_groq_api_key_here  # For AI chatbot features
NEXT_PUBLIC_API_URL=  # Leave empty for same-origin requests
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Prepare your code:**
   ```bash
   # Make sure everything is committed
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Push to GitHub:**
   - Create a GitHub repository
   - Push your code:
     ```bash
     git remote add origin https://github.com/yourusername/mcdonalds-clone.git
     git push -u origin main
     ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Next.js (auto-detected)
     - **Root Directory**: `./` (default)
     - **Build Command**: `npm run build` (default)
     - **Output Directory**: `.next` (default)

4. **Add Environment Variables:**
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add each variable:
     - `MONGODB_URI` = `your_mongodb_atlas_connection_string`
     - `JWT_SECRET` = `generate-a-strong-random-secret`
     - `GROQ_API_KEY` = `your_groq_api_key` (optional)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

6. **Seed Database (One-time):**
   - After deployment, you need to seed the database
   - Option A: Use Vercel CLI:
     ```bash
     npm i -g vercel
     vercel login
     vercel env pull .env.local
     npm run seed
     ```
   - Option B: Use MongoDB Atlas Data Explorer to manually add data
   - Option C: Create a one-time API endpoint to seed (remove after use)

#### Vercel Configuration File (Optional):

Create `vercel.json` in root:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

---

### Option 2: Railway

Railway provides easy deployment with database support.

#### Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or upload code)

3. **Configure Service:**
   - Railway auto-detects Next.js
   - Add environment variables in **Variables** tab:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `GROQ_API_KEY` (optional)

4. **Deploy:**
   - Railway automatically builds and deploys
   - Get your app URL from the dashboard

5. **Seed Database:**
   - Use Railway CLI or connect via MongoDB Atlas

---

### Option 3: Render

Render offers free tier with easy setup.

#### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service:**
   - Connect your GitHub repository
   - Select "Web Service"
   - Configure:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Add Environment Variables:**
   - Go to **Environment** section
   - Add all required variables

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment

---

### Option 4: Self-Hosted (VPS/Docker)

For more control, deploy on your own server.

#### Using Docker:

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Update `next.config.js`:**
   ```js
   const nextConfig = {
     reactStrictMode: true,
     output: 'standalone', // Add this
     images: {
       domains: ['images.unsplash.com', 'via.placeholder.com'],
     },
   }
   ```

3. **Build and run:**
   ```bash
   docker build -t mcdonalds-clone .
   docker run -p 3000:3000 --env-file .env.local mcdonalds-clone
   ```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string (use `openssl rand -base64 32`)
- [ ] Ensure MongoDB Atlas IP whitelist includes your hosting platform's IPs (or use `0.0.0.0/0` for development)
- [ ] Review and remove any console.log statements with sensitive data
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Set up proper CORS if needed
- [ ] Review API rate limiting (consider adding)
- [ ] Remove any test/debug endpoints

## 📊 Post-Deployment Steps

1. **Test the Application:**
   - Visit your deployed URL
   - Test all major features:
     - Homepage loads
     - Menu browsing
     - Product details
     - Cart functionality
     - User signup/login
     - Order placement
     - AI chatbot (if Groq API key is set)

2. **Seed the Database:**
   - Run the seed script or manually add data via MongoDB Atlas

3. **Monitor:**
   - Check application logs
   - Monitor MongoDB Atlas for connection issues
   - Set up error tracking (optional: Sentry, LogRocket)

4. **Set up Custom Domain (Optional):**
   - In Vercel: Settings → Domains
   - Add your domain and configure DNS

## 🐛 Troubleshooting Deployment

### Build Fails

**Error: Module not found**
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Error: TypeScript errors**
```bash
npm run lint
# Fix all errors before deploying
```

### Runtime Errors

**Database connection fails:**
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas IP whitelist includes hosting platform IPs
- Ensure database name is in connection string

**Environment variables not working:**
- Restart the deployment after adding variables
- Verify variable names match exactly (case-sensitive)
- Check for typos in variable values

**API routes return 500:**
- Check server logs in hosting dashboard
- Verify all environment variables are set
- Test database connection separately

## 📈 Performance Optimization

1. **Enable Image Optimization:**
   - Next.js Image component is already used
   - Consider using Next.js Image CDN

2. **Enable Caching:**
   - Add cache headers for static assets
   - Use Redis for session storage (optional)

3. **Database Optimization:**
   - Add indexes to frequently queried fields
   - Use connection pooling (already implemented)

4. **Monitor Performance:**
   - Use Vercel Analytics (if on Vercel)
   - Set up monitoring tools

## 🔄 Continuous Deployment

Once set up, every push to your main branch will automatically deploy:

1. **Vercel**: Automatic (default)
2. **Railway**: Enable in settings
3. **Render**: Enable auto-deploy in dashboard

## 📝 Environment-Specific Configurations

### Development
```env
MONGODB_URI=mongodb://localhost:27017/mcdonalds-clone
JWT_SECRET=dev-secret-key
NEXT_PUBLIC_API_URL=
```

### Production
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mcdonalds-clone
JWT_SECRET=strong-production-secret-min-32-chars
NEXT_PUBLIC_API_URL=
GROQ_API_KEY=your_production_groq_key
```

## 🎯 Quick Deploy Commands

### Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Railway CLI
```bash
npm i -g @railway/cli
railway login
railway up
```

## 📞 Support

If you encounter issues:
1. Check application logs in hosting dashboard
2. Verify all environment variables
3. Test database connection separately
4. Review Next.js deployment docs: https://nextjs.org/docs/deployment

---

**Ready to deploy?** Choose your platform and follow the steps above! 🚀

