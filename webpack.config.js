/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */

const path = require('path');
const glob = require('glob');


const unitTests = glob.sync(`${path.resolve(__dirname, 'test/unit')}/**/*.js`);
const integrationTests =
  glob.sync(`${path.resolve(__dirname, 'test/integration')}/**/*.js`);
const allTests = unitTests.concat(integrationTests);

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    // to enable absolute path references
    root: __dirname,

    // sinon uses require() strangely: https://github.com/webpack/webpack/issues/304
    alias: {
      sinon: 'node_modules/sinon/pkg/sinon.js',
    },
  },

  module: {
    // this does the es2015 and JSX conversion
    loaders: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'test'),
      ],
      loader: 'babel-loader',
    }],

    // sinon uses require() strangely: https://github.com/webpack/webpack/issues/304
    noParse: [
      /\/sinon\.js/,
    ],
  },

  // the entrypoint for our resultant files
  entry: {
    'notate': path.resolve(__dirname, 'src/entry.js'),
    'test/unit': unitTests,
    'test/integration': integrationTests,
    'test/all': allTests,
  },

  // file and path for the resultant files
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/client'),
    libraryTarget: 'umd',
  },
};
