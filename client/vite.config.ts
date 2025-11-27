import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    base: '/',
    publicDir: 'public',
    resolve: {
        alias: {
            '@': resolve('./src'),
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        copyPublicDir: true,
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    forms: ['react-hook-form'],
                    ui: ['react-hot-toast', 'react-helmet-async'],
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        port: 3100,
        proxy: {
            '/api': {
                target: 'http://localhost:5100',
                changeOrigin: true,
            },
        },
    },
})
