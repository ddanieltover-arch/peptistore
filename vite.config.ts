import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const supabaseOrigin = (() => {
    try {
      return env.VITE_SUPABASE_URL ? new URL(env.VITE_SUPABASE_URL).origin : '';
    } catch {
      return '';
    }
  })();

  return {
    cacheDir: path.join(os.tmpdir(), 'peptistore-vite-cache'),
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-supabase-preconnect',
        transformIndexHtml(html) {
          if (!supabaseOrigin || html.includes(supabaseOrigin)) return html;
          const tag = `<link rel='preconnect' href='${supabaseOrigin}' crossorigin />`;
          return html.replace(
            "<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />",
            `<link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />\n    ${tag}`,
          );
        },
      },
    ],
    optimizeDeps: {
      // Avoid scanning scratch/*.html files that include external Shopify theme imports.
      entries: ['index.html'],
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('motion')) return 'vendor-motion';
            return 'vendor';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Forward /api → local Vercel dev or another backend (optional). Prefer `vercel dev` for full stack.
      ...(env.VITE_DEV_API_PROXY
        ? {
            proxy: {
              '/api': {
                target: env.VITE_DEV_API_PROXY,
                changeOrigin: true,
              },
            },
          }
        : {}),
    },
  };
});
