import { inspect } from 'util';

import merge from './merge';

'use strict';

function Breadcrumbs() {}

module.exports = Breadcrumbs;

// Public API
// =========

/*
`newError` simplifies the creation of `Error` objects in all javascript contexts.
In v8, you get a stack by default, but quite a few other platforms require a `throw`
to get the callstack.

_Note: we're keeping it simple; we don't do anything for the sad, old browsers which
need `window.onerror()` or `arguments.callee`-walking hacks to get a callstack._

Three optional parameters:

+ `message` is passed directly in the error construction: `new Error(message)`
+ `options` will have its keys merged into the returned error
+ `depth` allows you to put this method in your own helper, just set the depth to the
number of steps between the code you want to capture.
*/
Breadcrumbs.prototype.newError = function newError(message, options, depth) {
  depth = (depth || 0) + this._layerSize;

  var err = new Error(message);
  err.stack = this._getStackTrace(depth).join('\n');

  if (options) {
    merge(err, options);
  }

  return err;
};

/*
`add` is a new alternative to the these two methods of dealing with errors in
javascript:

```
if (err) {
  return cb(err);
}
```

and

```
if (err) {
  myFavoriteLogger.error('methodName: strange situation! ' +
    JSON.stringify(user));

  return cb(err);
}
```

Now you can do this, to accomplish the same thing. We attach the user to the error for
future log output, and `add()` adds the current file and line to the top of the stack.
So after an error happens deep in some library, you know how it propagated through your
code afterwards.

```
if (breadcrumbs.add(err, cb, {user: user})) {
  return;
}
```

The first parameter, `err` is required. If `err` is truthy, any provided callback will
be called and `add()` will return true.

There are three more optional parameters:

+ `cb` is called with `err` if `err` is truthy.
+ `data` will have its keys merged into the returned error
+ `depth` allows you to put this method in your own helper, just set the depth to the
number of steps between the code you want to capture.
*/
Breadcrumbs.prototype.add = function add(err, cb, data, depth) {
  if (!err) {
    return false;
  }

  depth = (depth || 0) + this._layerSize;

  this._insert(err, depth, data && data.backup);

  merge(err, data);

  if (cb) {
    cb(err);
  }

  return true;
};

/*
`toString()` prints out errors. Now that you're using `breadcrumbs.add()` to annotate
your errors as they propagate through your system, it's time to print them out properly.

First we do a `util.inspect()` of the error, grabbing all of those keys we've merged
into it for debugging purposes, and then we print out the stack after removing all
instances of `process.cwd()` (if we're on the server).

You can prevent the stack from being printed by setting `err.log` to something other
than 'warn' or 'error'.
*/
Breadcrumbs.prototype.toString = function toString(err) {
  if (!err) {
    return '';
  }

  var result = inspect(err, {depth: 5});

  if (!err.log || err.log === 'warn' || err.log === 'error') {
    result += '\n' + this._prepareStack(err);
  }

  return result;
};

// Helper functions
// ========

Breadcrumbs.prototype._at = '\n  at ';

// What goes in front of all breadcrumbs added to the stack.
Breadcrumbs.prototype._prefix = '**breadcrumb: ';

// The stack steps consumed for each functional call inside `Breadcrumbs`. For example
// if we ever do a `_.bindAll()`, the `_layerSize` can be set to 2 to make everything
// work again.
Breadcrumbs.prototype._layerSize = 1;

// `_getStackTrace` allows the platform to provide a stack before resorting to a
// `throw`. Then it slices off the top to get rid of everything but the code calling
// this library.
Breadcrumbs.prototype._getStackTrace = function _getStackTrace(depth) {
  var err = new Error('Something');

  if (!err.stack) {
    try {
      throw err;
    }
    catch (e) {
      err = e;
    }
  }

  var stack = err.stack || '';

  stack = stack
    .replace(/^ +at/, '  at')
    .split(/\n +at /)
    .join('\n  at ');

  var lines = stack.split('\n');

  //stack depth between _getStackTrace() and original caller
  depth = (depth || 0) + this._layerSize;

  if (lines && lines.length && /^Error/.test(lines[0])) {
    depth += 1;
  }

  return lines.slice(depth);
};

// `_get` constructs the actual breadcrumb from the top of the stack.
Breadcrumbs.prototype._get = function _get(depth) {
  var result = this._prefix + '<empty>';
  var v8 = /^ +at /;

  //stack depth between _getStackTrace() and original caller
  depth = (depth || 0) + this._layerSize;

  var lines = this._getStackTrace(depth);

  if (lines && lines.length) {
    result = lines[0];

    if (v8.test(result)) {
      result = result.replace(v8, this._prefix);
    }
    else {
      result = this._prefix + result;
    }
  }

  return result;
};

// `_insert` injects a breadcrumb into `err.stack`.
Breadcrumbs.prototype._insert = function _insert(err, depth) {
  if (!err) {
    return;
  }

  try {
    var stack = err.stack || '';
    var v8 = /\n +at /;

    //stack depth between _getStackTrace() and original caller
    depth = (depth || 0) + this._layerSize;
    var breadcrumb = this._get(depth);

    if (this._startsWithError(stack)) {
      var lines = stack.split(v8);
      var updated = [lines[0], breadcrumb];
      updated = updated.concat(lines.slice(1));

      err.stack = updated.join(this._at);
    }
    else if (this._hasAts(stack)) {
      stack = stack
        .replace(/^ +at/, '  at')
        .split(v8)
        .join('\n  at ');

      err.stack = '  at ' + breadcrumb + '\n' + stack;
    }
    else {
      err.stack = breadcrumb + '\n' + err.stack;
    }
  }
  catch (err) {
    console.error('Error: Cannot add breadcrumb to error -- ' + err.message);
  }
};

// `_prepareStack` does some stack massage to make it more printable.
Breadcrumbs.prototype._prepareStack = function _prepareStack(err) {
  err = err || {};
  var lines;
  var stack = err.stack || '';

  // Remove any instances of working directory
  if (typeof process !== 'undefined') {
    stack = stack.split(process.cwd()).join('');
  }

  // V8-style stacks include the error message before showing the actual stack;
  // remove it, even if it has newlines in it, by using each line's prefix to split it.
  if (this._startsWithError(stack)) {
    lines = stack.split(/\n +at /);
    if (lines && lines.length) {
      stack = '  at ' + lines.slice(1).join(this._at);
    }
  }

  // limit to ten lines
  lines = stack.split('\n');
  if (lines.length > 10) {
    stack = lines.slice(0, 10).join('\n') + '\n  ... (additional lines truncated)';
  }


  return stack;
};

Breadcrumbs.prototype._startsWithError = function _startsWithError(stack) {
  var v8 = /^[a-zA-z]+rror: /;
  return Boolean(v8.test(stack));
};

Breadcrumbs.prototype._hasAts = function _hasAts(stack) {
  var v8 = /\n +at /;
  return Boolean(v8.test(stack));
};
