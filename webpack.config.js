const path = require('path');

const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    port: 9000,
    contentBase: distDir,
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
    ],
  },
};
