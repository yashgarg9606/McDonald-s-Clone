import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { optionalAuth, AuthRequest } from '@/lib/auth';
import Groq from 'groq-sdk';

export default async function handler(
  req: AuthRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return optionalAuth(req, res, async () => {
    try {
      await connectDB();

      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Initialize Groq client
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        // Fallback to simple keyword matching if Groq API key is not set
        const response = await handleSimpleResponse(req, message);
        return res.status(200).json(response);
      }

      const groq = new Groq({
        apiKey: groqApiKey,
      });

      // Get all available products for context
      const allProducts = await Product.find({ available: true }).lean();
      
      // Get user's order history if authenticated
      let userOrders: any[] = [];
      if (req.user) {
        userOrders = await Order.find({ user: req.user.id })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
      }

      // Create product context string
      const productsContext = allProducts.map((p: any) => 
        `- ${p.name} (₹${p.price}): ${p.description}. Category: ${p.category}. Calories: ${p.nutrition?.calories || 'N/A'}. ${p.customizable ? 'Customizable.' : ''}`
      ).join('\n');

      // Create system prompt
      const systemPrompt = `You are a friendly AI ordering assistant for McDonald's. Help customers find the perfect meal based on their preferences, budget, dietary restrictions, or cravings.

Available Products:
${productsContext}

Your role:
1. Understand customer requests (budget, preferences, dietary needs, cravings)
2. Recommend relevant products from the list above
3. Be conversational, friendly, and helpful
4. If asked about specific products, provide details from the product list
5. If asked about order history, mention that the user needs to be logged in
6. Keep responses concise (2-3 sentences max) unless asked for details
7. Always mention product names and prices when recommending

When recommending products, format your response as:
- Main response text
- Then list product names that match (comma-separated, use exact names from the list)

${userOrders.length > 0 ? `User's recent orders: ${JSON.stringify(userOrders.map(o => ({ items: o.items, total: o.total })))}` : ''}

Respond naturally and helpfully.`;

      // Call Groq API - try multiple models in case one is unavailable
      const models = [
        'llama-3.1-8b-instant', // Fast and reliable
        'llama-3.3-70b-versatile', // More capable if available
        'mixtral-8x7b-32768', // Alternative option
      ];

      let completion;
      let lastError;
      
      // Try each model until one works
      for (const model of models) {
        try {
          completion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },
              {
                role: 'user',
                content: message,
              },
            ],
            model: model,
            temperature: 0.7,
            max_tokens: 500,
          });
          break; // Success, exit loop
        } catch (modelError: any) {
          lastError = modelError;
          console.warn(`Model ${model} failed, trying next...`);
          continue; // Try next model
        }
      }

      if (!completion) {
        throw lastError || new Error('All models failed');
      }

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

      // Extract product names from response and find matching products
      const productNames = allProducts.map((p: any) => p.name);
      const mentionedProducts = productNames.filter((name: string) => 
        aiResponse.toLowerCase().includes(name.toLowerCase())
      );

      // Get full product details for mentioned products
      const recommendedProducts = allProducts.filter((p: any) => 
        mentionedProducts.includes(p.name)
      ).slice(0, 5);

      // Handle order history requests
      let suggestions: any[] = [];
      const msg = message.toLowerCase();
      if ((msg.includes('order history') || msg.includes('previous orders') || msg.includes('my orders')) && req.user) {
        if (userOrders.length > 0) {
          suggestions = userOrders.map((order: any) => ({
            type: 'reorder',
            orderId: order._id,
            items: order.items,
          }));
        }
      } else if (recommendedProducts.length === 0) {
        // Add helpful suggestions if no specific products were recommended
        suggestions = [
          { type: 'suggestion', text: 'Show me items under ₹200' },
          { type: 'suggestion', text: 'I want something spicy' },
          { type: 'suggestion', text: 'Show vegetarian options' },
        ];
      }

      const response: any = {
        text: aiResponse,
        products: recommendedProducts.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
          category: p.category,
        })),
        suggestions,
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      // Check for model decommissioned error
      if (error?.error?.code === 'model_decommissioned' || error?.message?.includes('decommissioned')) {
        console.error('Model decommissioned. Please update the model in pages/api/ai/chatbot.ts');
        // Fallback to simple response
        try {
          const { message } = req.body;
          const fallbackResponse = await handleSimpleResponse(req, message);
          return res.status(200).json(fallbackResponse);
        } catch (fallbackError: any) {
          return res.status(500).json({ 
            error: 'The AI model is currently unavailable. Please try again later or contact support.' 
          });
        }
      }
      
      // Fallback to simple response on other errors
      try {
        const { message } = req.body;
        const fallbackResponse = await handleSimpleResponse(req, message);
        return res.status(200).json(fallbackResponse);
      } catch (fallbackError: any) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  });
}

// Fallback function for simple keyword matching (when Groq is not available)
async function handleSimpleResponse(req: AuthRequest, message: string) {
  await connectDB();

      const msg = message.toLowerCase();
      let response: any = {
        text: '',
        products: [],
        suggestions: [],
      };

  // Simple keyword matching logic (original implementation)
      if (msg.includes('budget') || msg.includes('price') || msg.includes('under') || msg.includes('₹')) {
        const budgetMatch = msg.match(/₹?\s*(\d+)/);
        const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

        if (budget) {
          const products = await Product.find({
            available: true,
            price: { $lte: budget },
          }).limit(5);

          response.text = `Here are some great options under ₹${budget}:`;
          response.products = products;
        } else {
          response.text = 'Could you please specify your budget? For example, "under ₹200"';
        }
      } else if (msg.includes('spicy')) {
        const products = await Product.find({
          available: true,
          $or: [
            { name: { $regex: 'spicy', $options: 'i' } },
            { description: { $regex: 'spicy', $options: 'i' } },
          ],
        }).limit(5);

        response.text = 'Here are some spicy options for you:';
        response.products = products;
      } else if (msg.includes('vegetarian') || msg.includes('veg')) {
        const products = await Product.find({
          available: true,
          name: {
            $not: {
              $regex: '(chicken|beef|meat|pork)',
              $options: 'i',
            },
          },
        }).limit(5);

        response.text = 'Here are some vegetarian options:';
        response.products = products;
      } else if (msg.includes('healthy') || msg.includes('nutrition') || msg.includes('low calorie')) {
        const products = await Product.find({ available: true })
          .sort({ 'nutrition.calories': 1 })
          .limit(5);

        response.text = 'Here are some healthier options with lower calories:';
        response.products = products;
      } else if (msg.includes('burger')) {
        const products = await Product.find({
          available: true,
          category: 'burgers',
        }).limit(5);

        response.text = 'Here are our burger options:';
        response.products = products;
      } else if (msg.includes('drink') || msg.includes('beverage')) {
        const products = await Product.find({
          available: true,
          category: 'beverages',
        }).limit(5);

        response.text = 'Here are our beverage options:';
        response.products = products;
      } else if (msg.includes('order history') || msg.includes('previous orders')) {
        if (req.user) {
          const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);

          response.text = `You have ${orders.length} recent orders. Would you like to reorder any?`;
          response.suggestions = orders.map((order) => ({
            type: 'reorder',
            orderId: order._id,
            items: order.items,
          }));
        } else {
          response.text = 'Please login to view your order history.';
        }
      } else {
        const products = await Product.find({ available: true }).limit(5);
        response.text = 'Here are some popular items. You can ask me to suggest items by budget, preferences (spicy, vegetarian, healthy), or browse by category (burgers, beverages, etc.)';
        response.products = products;
        response.suggestions = [
          { type: 'suggestion', text: 'Show me items under ₹200' },
          { type: 'suggestion', text: 'I want something spicy' },
          { type: 'suggestion', text: 'Show vegetarian options' },
        ];
      }

  return response;
}

