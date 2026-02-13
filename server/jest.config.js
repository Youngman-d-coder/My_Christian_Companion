module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', 'testSetup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Exclude main entry point
  ],
  testTimeout: 10000,
};
