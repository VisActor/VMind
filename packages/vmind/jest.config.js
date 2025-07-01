const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper,
    '@visactor/calculator': path.resolve(__dirname, '../calculator/src'),
    '@visactor/chart-advisor': path.resolve(__dirname, '../chart-advisor/src'),
    '@visactor/generate-vchart': path.resolve(__dirname, '../generate-vchart/src')
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false // ignore TypeScript error
      }
    ]
  }
};
