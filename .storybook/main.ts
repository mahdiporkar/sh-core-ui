import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
  framework: { name: '@storybook/react-webpack5', options: {} },
  docs: { autodocs: 'tag' },
  staticDirs: ['../public'],
  typescript: { reactDocgen: false },
  webpackFinal: (webpackConfig) => {
    webpackConfig.experiments = { ...webpackConfig.experiments, typescript: false };
    webpackConfig.module ??= { rules: [] };
    webpackConfig.module.rules ??= [];
    webpackConfig.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: { loader: 'ts-loader', options: { transpileOnly: true } },
    });
    webpackConfig.resolve ??= {};
    webpackConfig.resolve.extensions = [...(webpackConfig.resolve.extensions ?? []), '.ts', '.tsx'];
    return webpackConfig;
  },
};
export default config;
