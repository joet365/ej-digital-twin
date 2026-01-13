import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: 'dist-widget',
        lib: {
            entry: path.resolve(__dirname, 'src/widget.tsx'),
            name: 'ConquerWidget',
            fileName: (format) => `kate-widget.${format}.js`,
            formats: ['umd']
        },
        rollupOptions: {
            // Ensure React is bundled since the target site probably doesn't have it
            // typically widgets bundle EVERYTHING.
            external: [],
            output: {
                globals: {}
            }
        },
        // Minify for production
        minify: 'esbuild',
    },
});
