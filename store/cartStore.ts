import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string; // Unique ID based on product + customization
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  customization?: {
    size?: string;
    addedIngredients?: string[];
    removedIngredients?: string[];
  };
}

// Helper function to generate a unique ID for a cart item
function generateCartItemId(productId: string, customization?: CartItem['customization']): string {
  if (!customization || (!customization.size && !customization.addedIngredients?.length && !customization.removedIngredients?.length)) {
    return productId;
  }
  
  const parts = [productId];
  if (customization.size) parts.push(`size:${customization.size}`);
  if (customization.addedIngredients?.length) {
    parts.push(`added:${[...customization.addedIngredients].sort().join(',')}`);
  }
  if (customization.removedIngredients?.length) {
    parts.push(`removed:${[...customization.removedIngredients].sort().join(',')}`);
  }
  
  return parts.join('|');
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        // Ensure existing items have id field (migration for old cart items)
        const currentItems = get().items;
        const migratedItems = currentItems.map((i) => ({
          ...i,
          id: i.id || generateCartItemId(i.product, i.customization),
        }));
        if (migratedItems.some((i, idx) => !currentItems[idx]?.id)) {
          set({ items: migratedItems });
        }

        const itemId = generateCartItemId(item.product, item.customization);
        const items = get().items.map((i) => ({
          ...i,
          id: i.id || generateCartItemId(i.product, i.customization),
        }));
        const existingItem = items.find((i) => i.id === itemId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === itemId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, id: itemId, quantity: item.quantity || 1 }],
          });
        }
      },
      removeItem: (itemId) => {
        set({
          items: get().items.filter((i) => {
            const id = i.id || generateCartItemId(i.product, i.customization);
            return id !== itemId;
          }),
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
        } else {
          set({
            items: get().items.map((i) => {
              const id = i.id || generateCartItemId(i.product, i.customization);
              return id === itemId ? { ...i, id, quantity } : { ...i, id: i.id || id };
            }),
          });
        }
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

