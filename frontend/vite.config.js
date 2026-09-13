import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
// Vite config — https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        base: '/',
        plugins: [
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(import.meta.dirname, './src'),
            },
        },
        server: {
            host: '127.0.0.1',
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:5005',
                    changeOrigin: true,
                },
            },
        },
        preview: {
            host: '127.0.0.1',
            port: 5173,
        },
    };
});
