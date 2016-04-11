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
if (notate(err, cb, {user: user})) {
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
export default function notate(err, cb, data, depth) {
  if (!err) {
    return false;
  }

  depth = (depth || 0) + _internals.layerSize;

  const stack = _getStackTrace(depth);
  const line = _getFirstLine(stack);

  _insert(err, line);
  merge(err, data);

  if (cb) {
    cb(err);
  }

  return true;
}

/*
`prettyPrint()  ` prints out errors. Now that you're using `breadcrumbs.add()` to annotate
your errors as they propagate through your system, it's time to print them out properly.

First we do a `util.inspect()` of the error, grabbing all of those keys we've merged
into it for debugging purposes, and then we print out the stack after removing all
instances of `process.cwd()` (if we're on the server).

You can prevent the stack from being printed by setting `err.log` to something other
than 'warn' or 'error'.
*/
export function prettyPrint(err) {
  if (!err) {
    return '';
  }
  if (!_isError(err)) {
    return inspect(err);
  }

  // More special-casing for IE - util.inspect checks for message and description in keys,
  //   if found, switches to a basic err.toString() call, and we lose all extra data added
  //   to the error for debuggability.
  try {
    if (err.propertyIsEnumerable('message')) {
      Object.defineProperty(err, 'message', {
        enumerable: false,
        value: err.message
      });
    }

    if (err.description) {
      err._description = err.description;
      delete err.description;
    }
  }
  catch (e) {
    // do nothing
  }

  let result = inspect(err, {depth: 5});

  if (!err.log || err.log === 'warn' || err.log === 'error') {
    result += '\n' + _prepareStack(err);
  }

  return result;
}

// Internals
// ========

export const _internals = {
  at: 'at ',
  prefix: '**breadcrumb: ',
  layerSize: 1,
  truncation: '... (additional lines truncated)'
};

export function _getStackTrace(depth) {
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

  //stack depth between _getStackTrace() and original caller
  depth = (depth || 0) + _internals.layerSize;

  if (lines && lines.length && /^Error/.test(lines[0])) {
    depth += 1;
  }

  return lines.slice(depth);
}

export function _insert(err, line) {
  if (!err) {
    return;
  }

  const v8 = /\n +at /;
  let stack = err.stack || '';

  let indentation = _getIndentation(stack);

  if (_startsWithError(stack)) {
    const lines = stack.split(v8);
    const updated = [lines[0], line].concat(lines.slice(1));

    stack = updated.join('\n' + indentation + _internals.at);
  }
  else {
    stack = indentation + line + (stack ? '\n' + stack : '');
  }

  try {
    if (Object.defineProperty) {
      Object.defineProperty(err, 'stack', {
        value: stack,
        enumerable: false,
        configurable: true
      });
    }
    else {
      err.stack = stack;
    }
  }
  catch (err) {
    if (typeof console === 'undefined' || console || console.error) {
      console.error('Error: Cannot add line to error -- ' + err.message);
    }
  }
}

export function _prepareStack(err) {
  err = err || {};
  let stack = err.stack || '';
  const cwd = process.cwd();

  if (cwd !== '/') {
    stack = stack.split(cwd).join('');
  }

  const indentation = _getIndentation(stack);

  // V8-style stacks include the error message before showing the actual stack;
  // remove it, even if it has newlines in it, by using each line's prefix to split it.
  if (_startsWithError(stack)) {
    const lines = stack.split(/\n +at /);
    if (lines && lines.length) {
      stack = indentation + _internals.at +
        lines.slice(1).join('\n' + indentation + _internals.at);
    }
  }

  // limit to ten lines
  const lines = stack.split('\n');
  if (lines.length > 10) {
    stack = lines.slice(0, 10).join('\n') + '\n' + indentation + _internals.truncation;
  }

  return stack;
}

export function _getFirstLine(lines) {
  const v8 = /^ +at /;
  let result = _internals.prefix + '<empty>';

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

  const match = /^ +/.exec(last);
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
  return typeof err === 'object' && err !== null &&
    (Object.prototype.toString.call(err) === '[object Error]' || err instanceof Error);
}
