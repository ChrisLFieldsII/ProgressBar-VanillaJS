const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

// envs
const DEV = 'dev';
const PROD = 'prod';

const baseConfig = {
  plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin({ filename: 'index.css' })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};

const configHandler = {
  [DEV]: getDevConfig,
  [PROD]: getProdConfig,
};

function getConfig(env) {
  return configHandler[env]();
}

function getDevConfig() {
  return merge(baseConfig, {
    entry: './src/ProgressBar.js',
    mode: 'development',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: '@chrisfieldsii/progressbar-vanilla',
      libraryTarget: 'umd',
    },
  });
}

function getProdConfig() {
  return merge(baseConfig, {
    entry: './src/ProgressBar.js',
    mode: 'production',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: '@chrisfieldsii/progressbar-vanilla',
      libraryTarget: 'umd',
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
  });
}

module.exports = (env = DEV) => {
  return getConfig(env);
};
