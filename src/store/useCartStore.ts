import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  specification?: string;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number; // Percentage or absolute? Let's use percentage for simplicity
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, specification?: string) => void;
  updateQuantity: (productId: string, quantity: number, specification?: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  clearPromoCode: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.specification === item.specification
        );
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.specification === item.specification
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isOpen: true, // Auto open cart on add
          });
        } else {
          set({ items: [...items, item], isOpen: true }); // Auto open cart on add
        }
      },
      removeItem: (productId, specification) => {
        set({ 
          items: get().items.filter(
            (i) => !(i.productId === productId && i.specification === specification)
          ) 
        });
      },
      updateQuantity: (productId, quantity, specification) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.specification === specification 
              ? { ...i, quantity } 
              : i
          ),
        });
      },
      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),
      applyPromoCode: (code: string) => {
        if (code.toUpperCase() === 'PEPTIDE10') {
          set({ promoCode: 'PEPTIDE10', discount: 10 });
          return true;
        }
        return false;
      },
      clearPromoCode: () => set({ promoCode: null, discount: 0 }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = (subtotal * get().discount) / 100;
        return subtotal - discountAmount;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode, discount: state.discount }), // Don't persist UI state like isOpen
    }
  )
);
