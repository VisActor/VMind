const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testTimeout: 30000,
  silent: true,
  testMatch: ['**/__tests__/**/*.test.[jt]s'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        resolveJsonModule: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        module: 'ESNext',
        tsconfig: '<rootDir>/__tests__/tsconfig.json'
        // ts-jest configuration goes here
      }
    ]
  },
  globals: {
    __VERSION__: JSON.stringify('test'),
    __DEV__: JSON.stringify(true)
  },
  verbose: false,
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
    // 'd3-color': path.resolve(__dirname, './node_modules/d3-color/dist/d3-color.min.js'),
    // 'd3-array': path.resolve(__dirname, './node_modules/d3-array/dist/d3-array.min.js')
  },
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json-summary', 'lcov', 'text'],
  collectCoverageFrom: [
    '**/src/**',
    '!.rollup.cache/**',
    '!**/cjs/**',
    '!**/dist/**',
    '!**/es/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/types/**',
    '!**/interface.ts',
    '!**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
