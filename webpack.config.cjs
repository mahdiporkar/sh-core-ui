const path = require('node:path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const entry = {
  index: './src/index.ts',
  'components/index': './src/components/index.ts',
  'grid/index': './src/grid/index.tsx',
  'policy/index': './src/policy/index.tsx',
  'manifest/index': './src/manifest/index.ts',
  'tokens/index': './src/tokens/index.ts',
  'locales/index': './src/locales/index.ts',
};
const externals = [
  ({ request }, callback) => {
    if (
      request &&
      /^(react(?:-dom)?|antd|@ant-design\/icons|ag-grid-(?:community|enterprise|react))(?:\/.*)?$/.test(
        request,
      )
    ) {
      callback(null, `commonjs ${request}`);
      return;
    }
    callback();
  },
];
const common = {
  mode: 'production',
  entry,
  devtool: 'source-map',
  externals,
  optimization: { usedExports: true, minimize: false },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  stats: 'errors-warnings',
};
module.exports = [
  {
    ...common,
    name: 'esm',
    experiments: { outputModule: true },
    output: {
      path: path.resolve(__dirname, 'dist/esm'),
      filename: '[name].js',
      library: { type: 'module' },
      module: true,
      clean: true,
    },
  },
  {
    ...common,
    name: 'cjs',
    output: {
      path: path.resolve(__dirname, 'dist/cjs'),
      filename: '[name].cjs',
      library: { type: 'commonjs2' },
      clean: true,
    },
  },
];
