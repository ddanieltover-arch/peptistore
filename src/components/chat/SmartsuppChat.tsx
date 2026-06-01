import { useEffect } from 'react';

declare global {
  interface Window {
    _smartsupp?: Record<string, unknown>;
    smartsupp?: ((...args: unknown[]) => void) & { _: unknown[] };
    __smartsuppLoaded?: boolean;
  }
}

/**
 * Smartsupp loader.
 * Uses the native Smartsupp widget and its default launcher.
 */
export default function SmartsuppChat() {
  const key = (import.meta.env.VITE_SMARTSUPP_KEY as string | undefined)?.trim();

  useEffect(() => {
    if (!key) return;

    const brandColor =
      (import.meta.env.VITE_SMARTSUPP_COLOR as string | undefined)?.trim() || '#2563eb';

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = key;
    window._smartsupp.color = brandColor;

    if (!window.smartsupp) {
      const queue = ((...args: unknown[]) => {
        (queue._ = queue._ || []).push(args);
      }) as ((...args: unknown[]) => void) & { _: unknown[] };
      queue._ = [];
      window.smartsupp = queue;
    }

    if (document.getElementById('smartsupp-loader')) return;

    const script = document.createElement('script');
    script.id = 'smartsupp-loader';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src = 'https://www.smartsuppchat.com/loader.js?';

    script.onload = () => {
      window.__smartsuppLoaded = true;
      if (window.smartsupp) {
        window.smartsupp('theme:color', brandColor);
      }
    };

    document.head.appendChild(script);
  }, [key]);

  return null;
}

