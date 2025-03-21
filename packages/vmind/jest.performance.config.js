const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper,
    axios: path.resolve(__dirname, 'node_modules/axios/dist/node/axios.cjs')
  },
  verbose: true,
  // 在测试之前设置环境变量
  setupFiles: ['./test-setup.js']
};

// module.exports = {
//   preset: 'ts-jest',
//   silent: false,
//   globals: {
//     'ts-jest': {
//       resolveJsonModule: true,
//       esModuleInterop: true,
//       experimentalDecorators: true,
//       module: 'ESNext',
//       tsconfig: './tsconfig.test.json'
//     }
//   },
//   testTimeout: 60000,
//   moduleNameMapper: {
//     axios: 'axios/dist/node/axios.cjs',
//     'd3-hierarchy': 'd3-hierarchy/dist/d3-hierarchy.min.js',
//     '^src/(.*)$': '<rootDir>/src/$1'
//   },
//   verbose: true,
//   // 在测试之前设置环境变量
//   setupFiles: ['./test-setup.js'],
//   testEnvironment: 'node'
// };
