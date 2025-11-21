import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteTsConfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteTsConfigPaths(), nodePolyfills()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'fix-cosmjs-imports',
          setup(build) {
            build.onResolve({ filter: /@cosmjs\/amino\/build\/.+\.js$/ }, (args) => {
              const modulePath = args.path.replace(
                '@cosmjs/amino',
                path.join(process.cwd(), 'node_modules', '@cosmjs', 'amino')
              );
              return {
                path: modulePath,
              };
            });
          },
        },
      ],
    },
  },
});
