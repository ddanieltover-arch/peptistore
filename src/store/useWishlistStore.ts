import { create } from 'zustand';
import { supabase } from '../supabase';

interface WishlistState {
  productIds: string[];
  fetchWishlist: (userId: string) => Promise<void>;
  toggleWishlist: (productId: string, userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  fetchWishlist: async (userId: string) => {
    if (!userId) {
      set({ productIds: [] });
      return;
    }
    try {
      const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', userId);
      const ids = data ? data.map((d: any) => d.product_id) : [];
      set({ productIds: ids });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  },
  toggleWishlist: async (productId: string, userId: string) => {
    if (!userId) return;
    
    const currentIds = get().productIds;
    const isAdding = !currentIds.includes(productId);
    
    try {
      if (isAdding) {
        set({ productIds: [...currentIds, productId] });
        await supabase.from('wishlist').insert([{ user_id: userId, product_id: productId }]);
      } else {
        set({ productIds: currentIds.filter(id => id !== productId) });
        await supabase.from('wishlist').delete().match({ user_id: userId, product_id: productId });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      // Revert optimism
      if (isAdding) set({ productIds: currentIds.filter(id => id !== productId) });
      else set({ productIds: [...currentIds, productId] });
    }
  }
}));
