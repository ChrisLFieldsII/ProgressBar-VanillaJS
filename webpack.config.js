const path = require('path');
const merge = require('webpack-merge');

// envs
const DEV = 'dev';
const PROD = 'prod';

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
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
  });
}

module.exports = (env = DEV) => {
  console.log('\n');
  console.log('====='.repeat(5));
  console.log(`Building for env: ${env}`);
  return getConfig(env);
};
