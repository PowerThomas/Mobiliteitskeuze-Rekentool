import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: true,
      reporter: ['text', 'html']
    }
  }
});
