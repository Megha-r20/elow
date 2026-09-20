import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    testTimeout: 60000,
    hookTimeout: 120000,
    fileParallelism: false,
  },
});
