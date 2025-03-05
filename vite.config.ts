import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process.env.FACEBOOK_PAGE_ID': JSON.stringify(process.env.FACEBOOK_PAGE_ID),
    'process.env.INSTAGRAM_ACCOUNT_ID': JSON.stringify(process.env.INSTAGRAM_ACCOUNT_ID),
    'process.env.TWITTER_ACCOUNT_ID': JSON.stringify(process.env.TWITTER_ACCOUNT_ID),
    'process.env.TIKTOK_ACCOUNT_ID': JSON.stringify(process.env.TIKTOK_ACCOUNT_ID),
  },
});