'use strict';

// Platforms, in priority order:
//   Chrome
//   Firefox
//   IE 11
//   Mobile Safari
//   Chrome for Android
//   Safari
//   Edge

// Current total: 71.47%
//   (from mobile table in spreadsheet)
//   Note: Doesn't capture various OSes very well
//   Also completely blind to issues specific to older browsers and OSes
var platforms = [
  // Chrome
  ['Windows 10', 'chrome', '49'], // 14.17%
  ['Windows 10', 'chrome', '48'], // 13.03%

  // Android - chrome: 14.92%, general: 4.49%
  ['Linux', 'android', '5.1'],
  ['Linux', 'android', '4.4'],

  // Mobile Safari - ipad: 3.13%, iphone: 7.02%
  ['Mac 10.10', 'iphone', '9.2'],
  ['Mac 10.10', 'iphone', '8.4'],

  // Firefox
  ['Windows 10', 'firefox', '45'], // 2.55%
  ['Windows 10', 'firefox', '44'], // 3.74%

  // IE 11 - 5.58%
  ['Windows 10', 'internet explorer', '11'],
  ['Windows 2012', 'internet explorer', '10'],

  // Safari
  ['Mac 10.11', 'safari', '9'], // 1.56%
  ['Mac 10.10', 'safari', '8'], // 0.29%

  // Edge
  ['Windows 10', 'microsoftedge', '13'], // 0.99%

  // The pain!
  // ['Windows 2008', 'internet explorer', '9'], // no stacktraces!
  // ['Windows 2003', 'internet explorer', '8'], // no stacktraces, defineProperty broken!
];

module.exports = {
  tunnel: {
    command: null,
    args: null,
  },

  sauce: {
    username: null,
    key: null,
    url: null,

    name: 'notate',

    framework: 'mocha',
    platforms: platforms,

    timeout: 20 * 1000,
    pollTimeout: 10 * 1000,
  },
};
