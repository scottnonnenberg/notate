/* eslint-disable security/detect-object-injection, no-restricted-syntax */

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function findFreeKey(key, object) {
  let index = 2;
  let newKey = key + index;

  while (typeof object[newKey] !== 'undefined') {
    index += 1;
    newKey = key + index;
  }

  return newKey;
}

export default function merge(target, source) {
  if (!target || !source) {
    return;
  }

  for (const key in source) {
    if (hasOwnProperty.call(source, key)) {
      if (typeof target[key] === 'undefined') {
        target[key] = source[key];
      }
      else {
        const newKey = findFreeKey(key, target);
        target[newKey] = source[key];
      }
    }
  }
}
