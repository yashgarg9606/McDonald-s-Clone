# 🎨 Favicon Setup Guide

## 📁 Where to Place Your Favicon

**Place your favicon image in the `app` directory.** Next.js 14 will automatically detect and use it!

### ✅ Simple Setup (Recommended):

1. **Take your image file** (PNG, JPG, or ICO format)
2. **Rename it to `icon.png`** (or `icon.jpg`, `icon.ico`)
3. **Place it here**: `/Users/yashgarg/Desktop/McD/app/icon.png`

That's it! Next.js will automatically:
- ✅ Use it as the favicon (browser tab icon)
- ✅ Generate all required sizes
- ✅ Optimize it for different devices

## 📝 File Structure:

```
McD/
├── app/
│   ├── icon.png          ← YOUR FAVICON HERE (just drop your image here!)
│   ├── apple-icon.png    ← Optional: For iOS devices (180x180px)
│   ├── opengraph-image.png ← Optional: For social sharing (1200x630px)
│   └── twitter-image.png   ← Optional: For Twitter cards (1200x600px)
└── ...
```

## 🎯 Recommended Image Specs:

### Main Favicon (`app/icon.png`):
- **Size**: 512x512px or larger (square)
- **Format**: PNG (best quality)
- **Aspect Ratio**: 1:1 (square)

### Social Sharing (`app/opengraph-image.png`) - Optional:
- **Size**: 1200x630px
- **Format**: PNG or JPG
- **Purpose**: Shows when sharing on Facebook, LinkedIn, WhatsApp, etc.

### Apple Icon (`app/apple-icon.png`) - Optional:
- **Size**: 180x180px
- **Format**: PNG
- **Purpose**: For iOS home screen when users add to home screen

## 🚀 Quick Steps:

1. **Get your image ready:**
   - Make sure it's square (1:1 aspect ratio)
   - Recommended: 512x512px or larger
   - PNG format works best

2. **Add to project:**
   - Copy your image file
   - Paste it into: `/Users/yashgarg/Desktop/McD/app/`
   - Rename it to: `icon.png`

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Check it works:**
   - Open your app in browser
   - Look at the browser tab - you should see your favicon!
   - Hard refresh if needed: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

## 📱 For Social Sharing (Optional but Recommended):

To show a nice preview when sharing your site:

1. Create a larger image: **1200x630px**
2. Place it as: `app/opengraph-image.png`
3. This will be used automatically for:
   - Facebook shares
   - LinkedIn shares
   - WhatsApp link previews
   - Twitter/X cards
   - Other social platforms

## ✅ What's Already Configured:

- ✅ Metadata updated in `app/layout.tsx`
- ✅ Open Graph tags configured
- ✅ Twitter card tags configured
- ✅ Ready to use your favicon!

## 🧪 Test Your Favicon:

1. **Browser Tab**: Check the tab icon
2. **Social Sharing**: Use https://www.opengraph.xyz/ to test
3. **Mobile**: Add to home screen to see Apple icon (if added)

---

**That's it!** Just drop your image file in the `app` folder as `icon.png` and you're done! 🎉

