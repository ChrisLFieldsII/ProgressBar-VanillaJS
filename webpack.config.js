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
  entry: './src/ProgressBar.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: '@chrisfieldsii/progressbar-vanillajs',
    libraryTarget: 'umd',
  },
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
    mode: 'development',
  });
}

function getProdConfig() {
  return merge(baseConfig, {
    mode: 'production',
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
  });
}

module.exports = (env = DEV) => {
  return getConfig(env);
};
