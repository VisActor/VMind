const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper
    //axios: path.resolve(__dirname, '../../node_modules/axios/dist/node/axios.cjs')
  },
  silent: false, // 允许 console 输出
  verbose: true, // 显示详细信息
  collectCoverage: false, // 关闭覆盖率收集，避免干扰日志
  // 在测试之前设置环境变量
  setupFiles: ['./test-setup.js'],
  testEnvironment: 'node', // 使用 node 环境
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        resolveJsonModule: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        module: 'ESNext',
        tsconfig: './tsconfig.json'
      }
    ]
  }
};
