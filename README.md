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
    if (notate(err, cb, { url }) {
      return;
    }

    return cb(null, result);
  });
}
```

What does this get you?

1. Now you know you won't crash the first time your code hits that `return;` line.
2. Later, when that error bubbles up to your top level, you'll have an entry in the callstack for this function, added by `notate()`. The `url` property will also be added to the error to aid debugging.

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
