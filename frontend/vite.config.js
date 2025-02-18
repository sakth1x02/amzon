import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': 'http://internal-application-tier-ALB-1903268183.us-east-2.elb.amazonaws.com:4000' // Update this to your live ALB address and port
    }
  },
  build: {
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      treeshake: true
    }
  }
});
