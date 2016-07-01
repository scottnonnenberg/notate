/* eslint-disable max-params, complexity, max-statements */

import { inspect } from 'util';

import merge from './merge';

// Public API
// =========

/*
`notate` is a new alternative to the these two methods of dealing with errors in
javascript:

```
if (err) {
  return cb(err);
}
```

and

```
if (err) {
  myFavoriteLogger.error('methodName: strange situation! ' + JSON.stringify(user));
  return cb(err);
}
```

To accomplish the same thing with `notate()`, attach the user to the error for
future log output, and `add()` adds the current file and line to the top of the stack.
So after an error happens deep in some library, you know how it propagated through your
code afterwards.

```
if (notate(cb, err, {user: user})) {
  return;
}
```

The first parameter, `err` is required. If `err` is truthy, any provided callback will
be called and `add()` will return true.

There are three more optional parameters:

+ `cb` is called with `err` if `err` is truthy.
+ `data` will have its keys merged into the returned error
+ `depth` allows you to put this method in your own helper, just set the depth to the
number of stack frames you add between the client code and `notate()`.
*/
export default function notate(cb, err, data, providedDepth) {
  if (cb && !_isFunction(cb)) {
    throw new Error('notate: provided first parameter cb was not a function');
  }
  if (!err) {
    return false;
  }

  const depth = (providedDepth || 0) + _internals.layerSize;
  justNotate(err, data, depth);

  if (cb) {
    // we really mean to omit the return here
    /* eslint-disable callback-return */
    cb(err);
    /* eslint-enable callback-return */
  }

  return true;
}

/*
`justNotate` does the same thing as `notate`, without taking (and requiring) the initial
`cb` parameter.
*/
export function justNotate(err, data, providedDepth) {
  if (!err) {
    return false;
  }

  try {
    const depth = (providedDepth || 0) + _internals.layerSize;

    const stack = _getStackTrace(depth);
    const line = _getFirstLine(stack);

    _insert(err, line);
    merge(err, data);
  }
  catch (e) {
    // do nothing; we must never crash!
  }

  return true;
}


/*
`prettyPrint()` prints out errors. Now that you're using `notate()` to annotate
your errors as they propagate through your system, it's time to print them out properly.

First we do a `util.inspect()` of the error, grabbing all of those keys we've merged
into it for debugging purposes, and then we print out the stack after removing all
instances of `process.cwd()` (if we're on the server).

You can prevent the stack from being printed by setting `err.log` to something other
than 'warn' or 'error'.
*/
export function prettyPrint(err, providedOptions) {
  let result = '';

  try {
    if (!err) {
      return result;
    }
    if (!_isError(err) && !err.stack) {
      return inspect(err);
    }

    // More special-casing for IE - util.inspect checks for message and description in
    //   keys, if found, switches to a basic err.toString() call, and we lose all extra
    //   data added to the error for debuggability.
    if (propertyIsEnumerable.call(err, 'message')) {
      defineProperty(err, 'message', {
        enumerable: false,
        value: err.message,
      });
    }

    if (err.description) {
      err._description = err.description;
      delete err.description;
    }
    // ...end IE weirdness

    result = inspect(err, { depth: 5 });

    // Normalize new Node v6 util.inspect() behavior
      // v4: https://github.com/nodejs/node/blob/2ce83bd8f91dec603740cce216259f3f3ac1b364/lib/util.js#L458-L460
      // v6: https://github.com/nodejs/node/blob/ee8e7cd25d232a115ff4b1b5f5dd91ca442bacae/lib/util.js#L629-L631
    const withKeys = /^\{ \[/;
    const plain = /^\[/;
    if (!withKeys.test(result) && !plain.test(result)) {
      result = result.replace(err.stack, `[${Error.prototype.toString.call(err)}]`);
    }

    if (!err.log || err.log === 'warn' || err.log === 'error') {
      result += `\n${_prepareStack(err, providedOptions)}`;
    }
  }
  catch (e) {
    // do nothing
  }

  return result;
}

// Internals
// ========

const MAX_LINES = 10;
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
const getDescriptor = Object.getOwnPropertyDescriptor;
const defineProperty = Object.defineProperty;
const toString = Object.prototype.toString;

export const _internals = {
  at: 'at ',
  prefix: '**notate: ',
  layerSize: 1,
  truncation: '... (additional lines truncated)',
};

export function _isFunction(fn) {
  if (!fn) {
    return false;
  }
  if (toString.call(fn) !== '[object Function]') {
    return false;
  }

  return true;
}

export function _getStackTrace(providedDepth) {
  let err = new Error('Something');

  // fuck internet explorer
  if (!err.stack) {
    try {
      throw err;
    }
    catch (e) {
      err = e;
    }
  }

  const stack = (err.stack || '')
    .replace(/^ +at/, '  at')
    .split(/\n +at /)
    .join('\n  at ');

  const lines = stack.split('\n');

  // stack depth between _getStackTrace() and original caller
  let depth = (providedDepth || 0) + _internals.layerSize;

  if (lines && lines.length && (/^Error/).test(lines[0])) {
    depth += 1;
  }

  return lines.slice(depth);
}

export function _insert(err, line) {
  if (!err) {
    return;
  }

  const v8 = /\n +at /;
  // we use alternateStack when we can't update stack (PhantomJS)
  let stack = err.alternateStack || err.stack || '';
  const indentation = _getIndentation(stack);

  if (_startsWithError(stack)) {
    const lines = stack.split(v8);
    const updated = [lines[0], line].concat(lines.slice(1));

    stack = updated.join(`\n${indentation}${_internals.at}`);
  }
  else {
    stack = indentation + line + (stack ? `\n${stack}` : '');
  }

  try {
    if (!getDescriptor || !defineProperty) {
      err.stack = stack;
    }

    const descriptor = getDescriptor(err, 'stack');
    if (!descriptor || descriptor.configurable
      && (!descriptor.writable || descriptor.enumerable)) {
      defineProperty(err, 'stack', {
        value: stack,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }
    else if (descriptor.writable) {
      err.stack = stack;
    }
    else {
      defineProperty(err, 'alternateStack', {
        value: stack,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }
  }
  catch (error) {
    if (typeof console !== 'undefined' && console && console.error) {
      console.error(`Error: Cannot add line to stack -- ${error.message}`);
    }
  }
}

export function _prepareStack(providedErr, providedOptions) {
  const err = providedErr || {};
  let stack = err.alternateStack || err.stack || '';
  const cwd = process.cwd();

  if (cwd !== '/') {
    stack = stack.split(cwd).join('');
  }

  const indentation = _getIndentation(stack);
  const options = providedOptions || {};
  const maxLines = options.maxLines || MAX_LINES;

  // V8-style stacks include the error message before showing the actual stack;
  // remove it, even if it has newlines in it, by using each line's prefix to split it.
  if (_startsWithError(stack)) {
    const lines = stack.split(/\n +at /);
    if (lines && lines.length) {
      stack = indentation + _internals.at
        + lines.slice(1).join(`\n${indentation}${_internals.at}`);
    }
  }

  // limit to ten lines
  const lines = stack.split('\n');
  if (lines.length > maxLines) {
    stack =
      `${lines.slice(0, maxLines).join('\n')}\n${indentation}${_internals.truncation}`;
  }

  return stack;
}

export function _getFirstLine(lines) {
  const v8 = /^ +at /;
  let result = `${_internals.prefix}<empty>`;

  if (lines && lines.length) {
    result = lines[0];

    if (v8.test(result)) {
      result = result.replace(v8, _internals.prefix);
    }
    else {
      result = _internals.prefix + result;
    }
  }

  return result;
}

export function _getIndentation(text) {
  if (!text || !text.split) {
    return '';
  }

  const lines = text.split('\n');
  const last = lines[lines.length - 1];

  const match = (/^ +/).exec(last);
  if (match) {
    return match[0];
  }

  return '';
}

export function _startsWithError(stack) {
  const v8 = /^[a-zA-z]+rror(:|\n)/;
  return Boolean(v8.test(stack));
}

export function _isError(err) {
  return typeof err === 'object' && err !== null
    && (Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error);
}
