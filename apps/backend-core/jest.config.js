/** @type {import('jest').Config} */
module.exports = {
  rootDir: './src',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  coverageProvider: 'v8',
};
