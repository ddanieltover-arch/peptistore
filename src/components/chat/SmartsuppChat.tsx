import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    _smartsupp?: Record<string, unknown>;
    smartsupp?: ((...args: unknown[]) => void) & { _: unknown[] };
    __smartsuppLoaded?: boolean;
  }
}

const STYLE_ID = 'smartsupp-hide-default-bubble';

/** Hide Smartsupp's default floating launcher; custom button uses chat:show / chat:open. */
function hideDefaultSmartsuppLauncher() {
  const root = document.getElementById('smartsupp-widget-container');
  if (!root) return;

  const hide = (el: Element) => {
    (el as HTMLElement).style.setProperty('display', 'none', 'important');
    (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
    (el as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
  };

  root.querySelectorAll('button, [role="button"], a').forEach((node) => {
    const label = (node.getAttribute('aria-label') || '').toLowerCase();
    const title = (node.getAttribute('title') || '').toLowerCase();
    const test = `${label} ${title}`;
    if (
      test.includes('smartsupp') ||
      (test.includes('open') && test.includes('chat')) ||
      test === 'open live chat' ||
      test.includes('chat with us')
    ) {
      hide(node);
    }
  });

  root.querySelectorAll('iframe').forEach((iframe) => {
    const id = (iframe.getAttribute('id') || '').toLowerCase();
    const src = (iframe.getAttribute('src') || '').toLowerCase();
    if (id.includes('bubble') || src.includes('bubble') || src.includes('launcher')) {
      hide(iframe);
    }
  });

  root.querySelectorAll('*').forEach((host) => {
    const el = host as HTMLElement & { shadowRoot?: ShadowRoot };
    if (!el.shadowRoot) return;
    el.shadowRoot.querySelectorAll('button, [role="button"], a').forEach((node) => {
      const label = (node.getAttribute('aria-label') || '').toLowerCase();
      if (label.includes('smartsupp') || (label.includes('open') && label.includes('chat'))) {
        (node as HTMLElement).style.setProperty('display', 'none', 'important');
      }
    });
  });
}

/**
 * Smartsupp loader with a custom trigger. The default floating bubble is hidden so only
 * our branded button remains (official API has no widget:hide; hideBanner is legacy but
 * still helps on some widget versions).
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
    window._smartsupp.hideWidget = true;
    window._smartsupp.hideMobileWidget = true;
    // Legacy flag — still hides the default bubble on many installations (see Smartsupp customization docs).
    window._smartsupp.hideBanner = true;

    if (!window.smartsupp) {
      const queue = ((...args: unknown[]) => {
        (queue._ = queue._ || []).push(args);
      }) as ((...args: unknown[]) => void) & { _: unknown[] };
      queue._ = [];
      window.smartsupp = queue;
    }

    if (document.getElementById('smartsupp-loader')) {
      const t = window.setInterval(hideDefaultSmartsuppLauncher, 400);
      const mo = new MutationObserver(hideDefaultSmartsuppLauncher);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => {
        window.clearInterval(t);
        mo.disconnect();
      };
    }

    const script = document.createElement('script');
    script.id = 'smartsupp-loader';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    // Match official snippet: key only in _smartsupp, not in query string (avoids odd double-init behaviour).
    script.src = 'https://www.smartsuppchat.com/loader.js?';

    script.onload = () => {
      window.__smartsuppLoaded = true;
      hideDefaultSmartsuppLauncher();
    };

    document.head.appendChild(script);

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        #smartsupp-widget-container iframe[id*="bubble"],
        #smartsupp-widget-container iframe[id*="Bubble"],
        #smartsupp-widget-container iframe[src*="bubble"],
        #smartsupp-widget-container iframe[src*="Bubble"],
        .smartsupp-widget-bubble,
        #smartsupp-widget-bubble {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const interval = window.setInterval(hideDefaultSmartsuppLauncher, 400);
    const observer = new MutationObserver(hideDefaultSmartsuppLauncher);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, [key]);

  const openChat = () => {
    try {
      if (window.smartsupp) {
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

      <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
    </button>
  );
}
