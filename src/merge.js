export default function merge(target, source) {
  if (target && source) {
    for (var key in source) {
      if (source.hasOwnProperty(key) && typeof target[key] === 'undefined') {
        target[key] = source[key];
      }
    }
  }
}
