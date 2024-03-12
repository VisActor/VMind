/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const json = require('@rollup/plugin-json');

module.exports = {
  formats: ['cjs', 'es'],
  outputDir: {
    es: 'esm',
    cjs: 'cjs',
  },
  name: 'VMind',
  umdOutputFilename: 'index',
  rollupOptions: {
    plugins: [json()]
  },
};
