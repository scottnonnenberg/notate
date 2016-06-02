/* eslint-disable import/no-commonjs */

const config = require('./webpack.config');

// normal webpack config, just add pre-babel code coverage instrumentation
config.module.preLoaders = [{
  test: /\.js$/,
  exclude: /(node_modules|test)\//,
  loader: 'babel-istanbul-loader',
}];

module.exports = config;
