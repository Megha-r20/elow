import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
                '@': path.resolve(__dirname, './src'),
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
            proxy: {
                '/api': {
                    target: 'http://localhost:5005',
                    changeOrigin: true,
                },
            },
        },
        build: {
            cssMinify: 'esbuild',
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                                return 'vendor-react';
                            }
                            if (id.includes('lucide-react')) {
                                return 'vendor-icons';
                            }
                        }
                    },
                },
            },
        },
        test: {
            environment: 'jsdom',
            globals: true,
        },
    };
});
