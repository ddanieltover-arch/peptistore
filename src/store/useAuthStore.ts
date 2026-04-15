import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  role: 'admin' | 'customer';
  created_at?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setAuthReady: (isReady: boolean) => void;
  fetchProfile: (uid: string, email: string, displayName: string | null, photoURL: string | null) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthReady: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setAuthReady: (isReady) => set({ isAuthReady: isReady }),
  fetchProfile: async (id, email, displayName, photoURL) => {
    try {
      const { data: existingUser, error: reqError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
        
      if (existingUser) {
        set({ profile: existingUser });
      } else {
        const newProfile = {
          id,
          email,
          display_name: displayName,
          photo_url: photoURL,
          role: email === 'peptistore3@gmail.com' ? 'admin' : 'customer'
        };
        const { data: inserted, error: insertError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single();
          
        if (inserted) {
          set({ profile: inserted });
        }
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
    }
  },
}));
