'use strict';

module.exports = function merge(target, source) {
  if (target && source && typeof source === 'object') {
    for (var key in source) {
      if (source.hasOwnProperty(key) && typeof target[key] === 'undefined') {
        target[key] = source[key];
      }
    }
  }
};
