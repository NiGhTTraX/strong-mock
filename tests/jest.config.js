const baseConfig = require('@tdd-buffet/jest-config');

module.exports = {
  testEnvironment: 'node',
  ...baseConfig,
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    '!**/*.mocks.ts',
    '!**/*.contract.ts',
  ],
};
