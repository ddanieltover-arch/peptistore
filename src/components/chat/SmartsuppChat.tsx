import { useEffect } from 'react';

declare global {
  interface Window {
    _smartsupp?: Record<string, unknown>;
    smartsupp?: ((...args: unknown[]) => void) & { _: unknown[] };
    __smartsuppLoaded?: boolean;
  }
}

/**
 * Smartsupp loader — deferred until interaction or idle to protect LCP.
 */
export default function SmartsuppChat() {
  const key = (import.meta.env.VITE_SMARTSUPP_KEY as string | undefined)?.trim();

  useEffect(() => {
    if (!key) return;

    const brandColor =
      (import.meta.env.VITE_SMARTSUPP_COLOR as string | undefined)?.trim() || '#2563eb';

    let loaded = false;

    const mount = () => {
      if (loaded) return;
      loaded = true;

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
        window.smartsupp?.('theme:color', brandColor);
      };

      document.head.appendChild(script);
    };

    const onInteract = () => mount();
    window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    window.addEventListener('keydown', onInteract, { once: true });

    const delayId = window.setTimeout(mount, 6000);
    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(mount, { timeout: 8000 })
        : undefined;

    return () => {
      window.clearTimeout(delayId);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, [key]);

  return null;
}
