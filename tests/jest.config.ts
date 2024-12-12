import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest';

const presetConfig = createDefaultPreset({
  tsconfig: './tsconfig.test.json',
});

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  testEnvironment: 'node',
  rootDir: process.cwd(),
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  coverageDirectory: '<rootDir>/tests/results',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ['**/src/**/*.{ts,tsx}', '!**/*.d.ts', '!**/*.mocks.ts'],
};

export default jestConfig;
