const path = require('node:path');
module.exports = (env = {}) => ({
  mode: 'production',
  entry: path.resolve(__dirname, env.fixture, 'index.js'),
  output: {
    path: path.resolve(__dirname, env.fixture, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    alias: {
      'sh-core-ui/components$': path.resolve(__dirname, '../dist/esm/components/index.js'),
      'sh-core-ui/grid$': path.resolve(__dirname, '../dist/esm/grid/index.js'),
      'sh-core-ui$': path.resolve(__dirname, '../dist/esm/index.js'),
    },
  },
  optimization: { usedExports: true },
  devtool: false,
});
