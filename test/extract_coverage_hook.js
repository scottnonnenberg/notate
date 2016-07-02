/* eslint-disable no-var, import/no-commonjs */
/* global window: true */

var fs = require('fs');

module.exports = {
  afterEnd: function afterEndHook(data) {
    var cov = data.page.evaluate(function getCoverage() {
      return window.__coverage__;
    });

    if (!cov) {
      console.log('No coverage data collected.');
    }
    else {
      console.log('Writing coverage to \'coverage/client/coverage.json\'');
      fs.makeTree('coverage/client');
      fs.write('coverage/client/coverage.json', JSON.stringify(cov));
    }
  },
};
