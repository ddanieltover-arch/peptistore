import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Link } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Cart</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                  {items.length} 
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Free UK/EU Shipping</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {amountToFreeShipping > 0 ? `£${amountToFreeShipping.toFixed(2)} away` : 'Unlocked!'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-2.5 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`} 
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                *International shipping is free over £1000
              </p>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is completely empty</p>
                  <button onClick={closeCart} className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.specification || 'default'}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="flex space-x-4 py-2"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg border dark:border-gray-800"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeItem(item.productId, item.specification)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.specification && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.specification}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border dark:border-gray-700 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.specification)}
                              className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.specification)}
                              className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            £{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                  <p>Subtotal</p>
                  <p>£{getTotal().toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02]"
                  >
                    Checkout securely
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
