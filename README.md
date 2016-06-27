# @scottnonnenberg/notate

Making it easier to debug asynchronous errors in javascript. Better than `if (err) { return cb(err) }`

## Quickstart

```bash
npm install --save-dev @scottnonnenberg/notate
```

In your code, whenever calling a callback, use `notate` to return the error instead of logging or just `return cb()`:

```javascript
import notate from '@scottnonnenberg/notate';

export function doAsync(url, cb) {
  someLib.go(url, function(err, result) {
    if (notate(cb, err, { url }) {
      return;
    }

    return cb(null, result);
  });
}
```

What does this get you?

1. Now you know you won't crash the first time your code hits your error-handling code, due to a mis-typed `return cb(err);`. That `return;` statement is simple and easy to get right.
2. Later, when that error bubbles up to your top level, you'll have an entry in the callstack for this function, added by `notate()`. The `url` property will also be added to the error to aid debugging. _Note: if an `url` property already exists on the `Error`, it will be come `url2`._

You can use `notate`'s `prettyPrint()` function to get the full benefit:

```javascript
import { prettyPrint } from 'notate';
import doAsync from './do_async';

doAsync('http://somewhere.com', function(err, result) {
  if (err) {
    console.log(prettyPrint(err));
    process.exitCode = 1;
    return;
  }

  console.log(result);
})
```

And it will look like this on Node.js - see [this page for browser examples](examples.md)):

```
{ [Error: Incorrect arguments supplied] url: ‘http://something’ }
    at **notate: /src/demos/4. Error from async call/b. with breadcrumbs.js:82:21
    at null._onTimeout (/src/demos/4. Error from async call/b. with breadcrumbs.js:13:17)
    at Timer.listOnTimeout (timers.js:92:15)
```

## API

```javascript
var notate = require('@scottnonnenberg/notate');
var justNotate = notate.justNotate;
var prettyPrint = notate.prettyPrint;

// or:
import { default as notate, justNotate, prettyPrint } from '@scottnonnenberg/notate';
```

* `notate(cb, err, data, level)` (default) - give it your callback, potential error, and any data you'd like merged into the error for later debugging. Throws if `cb` is not a function. `level` can be used to capture a different callstack entry other than the immediate caller of this function.
* `justNotate(err, data, level)` - just like `notate()` but without the `cb` parameter
* `prettyPrint(err, options)` - takes an `Error` which has additional stack entries and additional data added to it and prints it to a string. Note that, for some browsers, we need to use a new `alternateStack` key to store the annotated stack. `prettyPrint()` will handle this properly. `options` takes these keys:
  * `maxLines`: maximum number of callstack lines to include (default: 10)

## In-browser use

First, there's difficulty with minified code. The line numbers and function names won't mean much. However, the data you add to the error will still be present on the outputs of `prettyPrint()`, so I think it's worthwhile.

In development mode, you'll get an experience similar to the Node.js experience, except modern module loaders will put everything in one file. Naming your functions will really help here.

You can see what stacks look like on various browsers on the [stack examples page](examples.md).

Now, some notes on specific browsers:

### Internet Explorer 10/11

Everything will work as you expect, except for one thing: your `Error` objects will not have a callstack until you `throw` them. This library will annotate these stack-less `Error` objects, but you'll start from nothing.

To get the callstack when you create a new `Error`:

```javascript
var err = new Error('something went wrong');
if (!err.stack) {
  try {
    throw err;
  }
  catch (e) {
    err = e;
  }
}
```

Total pain, yes. [Edge](https://www.microsoft.com/en-us/windows/microsoft-edge) doesn't have this problem.

### Internet Explorer 9 and Safari 5

Sadly, these browsers don't give you stacktraces at all. So you're really down to the data you merge into the errors. Yes, you can use libraries like [StackTrace.js](https://www.stacktracejs.com/), but I'm not willing to go that far. Maybe if you ask really nice. But you should probably just fork this project to support those scenarios.

Do be aware that this project's Babel-produced code won't even load in IE9 without some modifications to the use of certain keywords. The [`es3ify`](https://github.com/spicyj/es3ify) node module and its [Webpack loader](https://github.com/sorrycc/es3ify-loader) will be necessary.

Additionally, when working with these browsers I would recommend that you force IE into standards mode: http://stackoverflow.com/questions/10975107/forcing-internet-explorer-9-to-use-standards-document-mode

### Internet Explorer 8 and below

Like IE9, old versions of IE won't provide callstacks. But you will find that modern Javascript techniques will cause parse and execute problems on these old browsers.

Thus, I used the babel plugin `es2015-loose` so basic modules don't use `Object.defineProperty()` to give proper ES2015 module semantics: http://www.2ality.com/2015/12/babel6-loose-mode.html In older browsers, `Object.defineProperty()` only works for DOM nodes. We didn't really need those semantics, right? :0)

## License

(The MIT license)

Copyright (c) 2016 Scott Nonnenberg <scott@nonnenberg.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
