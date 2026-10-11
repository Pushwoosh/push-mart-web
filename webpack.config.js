const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { TITLE, productPages, productFeedPlugin } = require('./build-tools/catalogPages');

const isProduction = process.env.NODE_ENV === 'production';
const analyzerMode = process.env.ANALYZER_MODE || 'disabled';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: 'source-map',
  entry: {
    'main': './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    assetModuleFilename: 'static/[name][ext]'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.png', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.?jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          },
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg)$/i,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ],
    }),
    new webpack.DefinePlugin({
      REACT_APP_API_URL: '',
      REACT_APP_PUSH_ID: '',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      chunks: ['main'],
      title: TITLE,
    }),
    // GitHub Pages has no SPA fallback: serve the app for unknown routes too.
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      chunks: ['main'],
      filename: '404.html',
      title: TITLE,
    }),
    ...productPages(path.join(__dirname, 'src')),
    productFeedPlugin,
    new BundleAnalyzerPlugin({
      analyzerMode: analyzerMode, // Options: 'server', 'static', 'disabled'
      openAnalyzer: true,     // Automatically open report in default browser
    }),
  ],

  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()],
  },
}
