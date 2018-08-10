const path = require('path');
const webpack = require('webpack');

const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    port: 9000,
    allowedHosts: ['.'],
    compress: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: distDir,
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVER_URL: JSON.stringify(process.env.SERVER_URL),
    }),
  ],
};
