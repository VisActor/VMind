import type { PluginItem, TransformOptions } from '@babel/core';

export type BabelPlugins = {
  presets: PluginItem[];
  plugins: PluginItem[];
};
export function getBabelPlugins(
  packageName: string,
  options?: {
    envOptions?: TransformOptions;
  }
): BabelPlugins {
  const plugins = [
    require.resolve('@babel/plugin-transform-private-methods'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    [
      require.resolve('babel-plugin-import'),
      {
        style: true,
        libraryName: packageName,
        libraryDirectory: 'es',
        camel2DashComponentName: false
      }
    ]
  ];

  const presets = [
    require.resolve('@babel/preset-react'),
    [require.resolve('@babel/preset-env'), { targets: 'defaults and not IE 11', ...options?.envOptions }],
    require.resolve('@babel/preset-typescript')
  ];

  return {
    presets,
    plugins
  };
}
