// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
  // Polyfill for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
  };

  // Add ProvidePlugin to automatically load Buffer and process where needed
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];

  return config;
};
