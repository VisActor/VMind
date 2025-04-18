import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import libCss from 'vite-plugin-libcss';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

//import css from 'vite-plugin-css';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyConfig = env.VITE_PROXY_CONFIG ? JSON.parse(env.VITE_PROXY_CONFIG) : undefined;

  return {
    // root: path.join(__dirname, 'src/site'),
    envDir: process.cwd(),
    plugins: [
      react(),
      libCss(),
      //css(),
      dynamicImportVars({
        //这里配置插件在那个文件夹内生效 这里是在router文件夹内生效
        include: ['src'],
        //这里是哪些文件夹内不生效
        exclude: [],
        //插件在遇到错误时会退出构建过程。如果您将此选项设置为 true，它将引发警告，并且保持代码不变。
        warnOnError: false
      }) as any
    ],
    define: {
      __DEV__: true
    },
    server: {
      host: '0.0.0.0',
      port: 3300,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      },
      proxy: {
        '/api': {
          target: 'https://byterec.bytedance.net',
          changeOrigin: true
        },
        '/proxy-image': {
          target: 'https://lf9-dp-fe-cms-tos.byteorg.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/proxy-image/, ''),
          configure: proxy => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none';
              proxyRes.headers['Cross-Origin-Resource-Policy'] = 'cross-origin';
            });
          }
        }
      },
      ...proxyConfig
    },
    resolve: {
      alias: {
        //src: path.resolve(__dirname, '../../src'),
        '@visactor/calculator': path.resolve(__dirname, '../../../calculator/src/index.ts'),
        '@visactor/chart-advisor': path.resolve(__dirname, '../../../chart-advisor/src/index.ts')
        // ...localConf.resolve?.alias
      }
    },
    build: {
      cssCodeSplit: true
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
          relativeUrls: true,
          javascriptEnabled: true
        }
      }
    }
  };
});
