const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
<<<<<<< Updated upstream
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testMatch: ['<rootDir>/__tests__/unit/*.test.(js|ts)'],
  silent: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      resolveJsonModule: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      module: 'ESNext',
      tsconfig: './tsconfig.test.json'
    }
  },
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['json-summary', 'lcov', 'text'],
  coveragePathIgnorePatterns: ['node_modules', '__tests__', 'interface.ts', '.d.ts', 'typings', 'vite'],
  collectCoverageFrom: [
    '**/src/**',
    '!**/cjs/**',
    '!**/build/**',
    '!**/esm/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/types/**',
    '!**/interface.ts',
    '!**/vite/**'
  ]
=======
  ...baseJestConfig,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper
  }
>>>>>>> Stashed changes
};
