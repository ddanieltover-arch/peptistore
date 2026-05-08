import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    _smartsupp?: Record<string, unknown>;
    smartsupp?: ((...args: unknown[]) => void) & { _: unknown[] };
    __smartsuppLoaded?: boolean;
  }
}

/**
 * Smartsupp loader with brand color support and custom trigger.
 * Docs: https://docs.smartsupp.com/chat-box/configuration/
 */
export default function SmartsuppChat() {
  const key = (import.meta.env.VITE_SMARTSUPP_KEY as string | undefined)?.trim();

  useEffect(() => {
    if (!key) return;

    const brandColor =
      (import.meta.env.VITE_SMARTSUPP_COLOR as string | undefined)?.trim() || '#2563eb';
    
    // Initialize Smartsupp configuration
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = key;
    window._smartsupp.color = brandColor;
    // Hide default bubble as we provide our own custom button
    window._smartsupp.hideWidget = true;

    // Official loader pattern: keep a queue function available before script loads.
    if (!window.smartsupp) {
      const queue = ((...args: unknown[]) => {
        (queue._ = queue._ || []).push(args);
      }) as ((...args: unknown[]) => void) & { _: unknown[] };
      queue._ = [];
      window.smartsupp = queue;
    }

    // Prevent multiple script injections
    if (document.getElementById('smartsupp-loader')) return;

    const script = document.createElement('script');
    script.id = 'smartsupp-loader';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    // Including key in URL is recommended for faster initialization and better CDN caching
    script.src = `https://www.smartsuppchat.com/loader.js?key=${key}`;
    
    script.onload = () => {
      window.__smartsuppLoaded = true;
      // Force show the widget interface but keep the bubble hidden
      if (window.smartsupp) {
        window.smartsupp('widget:hide'); // Ensure bubble is hidden
      }
    };
    
    document.head.appendChild(script);
  }, [key]);

  const openChat = () => {
    try {
      if (window.smartsupp) {
        // Show the chat box and then open it
        window.smartsupp('chat:show');
        window.smartsupp('chat:open');
      }
    } catch (err) {
      console.warn('Smartsupp open failed:', err);
    }
  };

  if (!key) return null;

  return (
    <button
      type="button"
      onClick={openChat}
      className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-[100] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group ring-4 ring-white/10"
      aria-label="Open live chat"
      title="Open live chat"
    >
      <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-12" aria-hidden />
      <span className="sr-only">Live Chat</span>
      
      {/* Subtle notification dot to attract attention */}
      <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
    </button>
  );
}


