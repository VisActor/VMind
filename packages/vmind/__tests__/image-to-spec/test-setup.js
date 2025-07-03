// Jest 测试环境设置文件
// 确保 console.log 能正常输出

// 保存原始的 console 方法
const originalConsole = { ...console };

// 重写 console 方法以确保在测试中正常显示
global.console = {
  ...originalConsole,
  log: (...args) => {
    originalConsole.log(...args);
  },
  info: (...args) => {
    originalConsole.info(...args);
  },
  warn: (...args) => {
    originalConsole.warn(...args);
  },
  error: (...args) => {
    originalConsole.error(...args);
  },
  debug: (...args) => {
    originalConsole.debug(...args);
  }
};

// 设置测试环境变量
process.env.NODE_ENV = 'test';
