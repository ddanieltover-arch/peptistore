import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function MobileBottomNav() {
  const { items, openCart } = useCartStore();
  const { user } = useAuthStore();
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>

        <NavLink 
          to="/shop" 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <List className="h-6 w-6" />
          <span className="text-[10px] font-medium">Shop</span>
        </NavLink>

        <button 
          onClick={openCart}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative text-gray-500 hover:text-gray-900"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>

        <NavLink 
          to={user ? "/profile" : "/login"} 
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">{user ? 'Account' : 'Login'}</span>
        </NavLink>
      </div>
    </div>
  );
}
