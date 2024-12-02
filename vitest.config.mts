import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    setupFiles: ['tests/setupTests.ts'],
    coverage: {
      thresholds: {
        '100': true,
      },
      reportsDirectory: 'tests/results',
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.mocks.ts', '**/*.spec.ts'],
    },
  },
});
