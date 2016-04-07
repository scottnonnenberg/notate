var webpack = require('webpack');
var config = require('./webpack.config');


config.devtool = 'source-map';
config.output.filename = '[name].min.js';

config.plugins = config.plugins || [];
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
}));

module.exports = config;
