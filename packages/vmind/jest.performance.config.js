const path = require('path');
const baseJestConfig = require('@internal/jest-config/jest.base');

module.exports = {
  ...baseJestConfig,
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper,
    axios: path.resolve(__dirname, 'node_modules/axios/dist/node/axios.cjs')
  },
  verbose: true,
  silent: false, // 允许 console.log 输出
  // 在测试之前设置环境变量
  setupFiles: ['./test-setup.js']
};
