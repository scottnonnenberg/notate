/* eslint-disable security/detect-object-injection, no-restricted-syntax */

const hasOwnProperty = Object.prototype.hasOwnProperty;

export default function merge(target, source) {
  if (target && source) {
    for (const key in source) {
      if (hasOwnProperty.call(source, key) && typeof target[key] === 'undefined') {
        target[key] = source[key];
      }
    }
  }
}
