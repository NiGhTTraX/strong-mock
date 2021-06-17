const baseConfig = require('@tdd-buffet/jest-config');

module.exports = {
  ...baseConfig,
  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    '!**/*.mocks.ts',
    '!**/*.contract.ts',
  ],
};
