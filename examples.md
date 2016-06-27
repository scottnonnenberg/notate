# Node.js 6.2.2

```
plain error.stack:
Error: user attempted something!
    at makeError (test_notate.js:19:21)
    at Context.<anonymous> (test_notate.js:38:21)
    at callFn (/path/to/project/node_modules/mocha/lib/runnable.js:286:21)
    at Test.Runnable.run (/path/to/project/node_modules/mocha/lib/runnable.js:279:7)
    at Runner.runTest (/path/to/project/node_modules/mocha/lib/runner.js:421:10)
    at /path/to/project/node_modules/mocha/lib/runner.js:528:12
    at next (/path/to/project/node_modules/mocha/lib/runner.js:341:14)
    at /path/to/project/node_modules/mocha/lib/runner.js:351:7
    at next (/path/to/project/node_modules/mocha/lib/runner.js:283:14)
    at Immediate._onImmediate (/path/to/project/node_modules/mocha/lib/runner.js:319:5)
    at tryOnImmediate (timers.js:543:15)
    at processImmediate [as _immediateCallback] (timers.js:523:5)

annotated error.stack:
Error: user attempted something!
    at **breadcrumb: annotateError (test_notate.js:35:9)
    at makeError (test_notate.js:19:21)
    at Context.<anonymous> (test_notate.js:38:21)
    at callFn (/path/to/project/node_modules/mocha/lib/runnable.js:286:21)
    at Test.Runnable.run (/path/to/project/node_modules/mocha/lib/runnable.js:279:7)
    at Runner.runTest (/path/to/project/node_modules/mocha/lib/runner.js:421:10)
    at /path/to/project/node_modules/mocha/lib/runner.js:528:12
    at next (/path/to/project/node_modules/mocha/lib/runner.js:341:14)
    at /path/to/project/node_modules/mocha/lib/runner.js:351:7
    at next (/path/to/project/node_modules/mocha/lib/runner.js:283:14)
    at Immediate._onImmediate (/path/to/project/node_modules/mocha/lib/runner.js:319:5)
    at tryOnImmediate (timers.js:543:15)
    at processImmediate [as _immediateCallback] (timers.js:523:5)

pretty error:
{ [Error: user attempted something!] user: 'username' }
    at **breadcrumb: annotateError (test_notate.js:35:9)
    at makeError (test_notate.js:19:21)
    at Context.<anonymous> (test_notate.js:38:21)
    at callFn (/node_modules/mocha/lib/runnable.js:286:21)
    at Test.Runnable.run (/node_modules/mocha/lib/runnable.js:279:7)
    at Runner.runTest (/node_modules/mocha/lib/runner.js:421:10)
    at /node_modules/mocha/lib/runner.js:528:12
    at next (/node_modules/mocha/lib/runner.js:341:14)
    at /node_modules/mocha/lib/runner.js:351:7
    at next (/node_modules/mocha/lib/runner.js:283:14)
    ... (additional lines truncated)
```

# Node.js 4.4.6

```
plain error.stack:
Error: user attempted something!
    at makeError (test_notate.js:19:21)
    at Context.<anonymous> (test_notate.js:38:21)
    at callFn (/path/to/project/node_modules/mocha/lib/runnable.js:286:21)
    at Test.Runnable.run (/path/to/project/node_modules/mocha/lib/runnable.js:279:7)
    at Runner.runTest (/path/to/project/node_modules/mocha/lib/runner.js:421:10)
    at /path/to/project/node_modules/mocha/lib/runner.js:528:12
    at next (/path/to/project/node_modules/mocha/lib/runner.js:341:14)
    at /path/to/project/node_modules/mocha/lib/runner.js:351:7
    at next (/path/to/project/node_modules/mocha/lib/runner.js:283:14)
    at Immediate._onImmediate (/path/to/project/node_modules/mocha/lib/runner.js:319:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)

annotated error.stack:
Error: user attempted something!
    at **breadcrumb: annotateError (test_notate.js:35:9)
    at makeError (test_notate.js:19:21)
    at Context.<anonymous> (test_notate.js:38:21)
    at callFn (/path/to/project/node_modules/mocha/lib/runnable.js:286:21)
    at Test.Runnable.run (/path/to/project/node_modules/mocha/lib/runnable.js:279:7)
    at Runner.runTest (/path/to/project/node_modules/mocha/lib/runner.js:421:10)
    at /path/to/project/node_modules/mocha/lib/runner.js:528:12
    at next (/path/to/project/node_modules/mocha/lib/runner.js:341:14)
    at /path/to/project/node_modules/mocha/lib/runner.js:351:7
    at next (/path/to/project/node_modules/mocha/lib/runner.js:283:14)
    at Immediate._onImmediate (/path/to/project/node_modules/mocha/lib/runner.js:319:5)
    at processImmediate [as _immediateCallback] (timers.js:383:17)

pretty error:
{ [Error: user attempted something!] user: 'username' }
    at **breadcrumb: annotateError (test_notate.js:35:9)
    at makeError (test_notate.js:19:21)
    at Context.<anonymous> (test_notate.js:38:21)
    at callFn (/node_modules/mocha/lib/runnable.js:286:21)
    at Test.Runnable.run (/node_modules/mocha/lib/runnable.js:279:7)
    at Runner.runTest (/node_modules/mocha/lib/runner.js:421:10)
    at /node_modules/mocha/lib/runner.js:528:12
    at next (/node_modules/mocha/lib/runner.js:341:14)
    at /node_modules/mocha/lib/runner.js:351:7
    at next (/node_modules/mocha/lib/runner.js:283:14)
    ... (additional lines truncated)
```

# Chrome 51, OSX

```
plain error.stack:
Error: user attempted something!
    at makeError (test_notate.js:22)
    at Context.<anonymous> (test_notate.js:40)
    at callFn (mocha.js:4202)
    at Test.Runnable.run (mocha.js:4195)
    at Runner.runTest (mocha.js:4661)
    at mocha.js:4768
    at next (mocha.js:4581)
    at mocha.js:4591
    at next (mocha.js:4523)
    at mocha.js:4559

annotated error.stack:
Error: user attempted something!
    at **breadcrumb: annotateError (test_notate.js:37)
    at makeError (test_notate.js:22)
    at Context.<anonymous> (test_notate.js:40)
    at callFn (mocha.js:4202)
    at Test.Runnable.run (mocha.js:4195)
    at Runner.runTest (mocha.js:4661)
    at mocha.js:4768
    at next (mocha.js:4581)
    at mocha.js:4591
    at next (mocha.js:4523)
    at mocha.js:4559

pretty error:
{ [Error: user attempted something!] user: 'username' }
    at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:33)
    at makeError (http://localhost:8001/dist/client/test/all.js:9766:22)
    at Context.<anonymous> (http://localhost:8001/dist/client/test/all.js:9784:20)
    at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:21)
    at Test.Runnable.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
    at Runner.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:10)
    at http://localhost:8001/node_modules/mocha/mocha.js:4768:12
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:14)
    at http://localhost:8001/node_modules/mocha/mocha.js:4591:7
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:14)
    ... (additional lines truncated)
```

# Firefox 45.0.2, OSX

```
plain error.stack:
makeError@http://localhost:8001/dist/client/test/all.js:9766:22
@http://localhost:8001/dist/client/test/all.js:9784:20
callFn@http://localhost:8001/node_modules/mocha/mocha.js:4202:18
[35]</</Runnable.prototype.run@http://localhost:8001/node_modules/mocha/mocha.js:4195:7
[36]</</Runner.prototype.runTest@http://localhost:8001/node_modules/mocha/mocha.js:4661:5
next/<@http://localhost:8001/node_modules/mocha/mocha.js:4768:7
next@http://localhost:8001/node_modules/mocha/mocha.js:4581:1
next/<@http://localhost:8001/node_modules/mocha/mocha.js:4591:7
next@http://localhost:8001/node_modules/mocha/mocha.js:4523:1
[36]</</Runner.prototype.hook/<@http://localhost:8001/node_modules/mocha/mocha.js:4559:5
timeslice@http://localhost:8001/node_modules/mocha/mocha.js:12326:5

annotated error.stack:
**breadcrumb: annotateError@http://localhost:8001/dist/client/test/all.js:9781:11
makeError@http://localhost:8001/dist/client/test/all.js:9766:22
@http://localhost:8001/dist/client/test/all.js:9784:20
callFn@http://localhost:8001/node_modules/mocha/mocha.js:4202:18
[35]</</Runnable.prototype.run@http://localhost:8001/node_modules/mocha/mocha.js:4195:7
[36]</</Runner.prototype.runTest@http://localhost:8001/node_modules/mocha/mocha.js:4661:5
next/<@http://localhost:8001/node_modules/mocha/mocha.js:4768:7
next@http://localhost:8001/node_modules/mocha/mocha.js:4581:1
next/<@http://localhost:8001/node_modules/mocha/mocha.js:4591:7
next@http://localhost:8001/node_modules/mocha/mocha.js:4523:1
[36]</</Runner.prototype.hook/<@http://localhost:8001/node_modules/mocha/mocha.js:4559:5
timeslice@http://localhost:8001/node_modules/mocha/mocha.js:12326:5

pretty error:
{ [Error: user attempted something!] user: 'username' }
**breadcrumb: annotateError@http://localhost:8001/dist/client/test/all.js:9781:11
makeError@http://localhost:8001/dist/client/test/all.js:9766:22
@http://localhost:8001/dist/client/test/all.js:9784:20
callFn@http://localhost:8001/node_modules/mocha/mocha.js:4202:18
[35]</</Runnable.prototype.run@http://localhost:8001/node_modules/mocha/mocha.js:4195:7
[36]</</Runner.prototype.runTest@http://localhost:8001/node_modules/mocha/mocha.js:4661:5
next/<@http://localhost:8001/node_modules/mocha/mocha.js:4768:7
next@http://localhost:8001/node_modules/mocha/mocha.js:4581:1
next/<@http://localhost:8001/node_modules/mocha/mocha.js:4591:7
next@http://localhost:8001/node_modules/mocha/mocha.js:4523:1
... (additional lines truncated)
```

# Safari 9.1, OSX

```
plain error.stack:
makeError@http://localhost:8001/dist/client/test/all.js:9766:31
http://localhost:8001/dist/client/test/all.js:9784:29
callFn@http://localhost:8001/node_modules/mocha/mocha.js:4202:25
run@http://localhost:8001/node_modules/mocha/mocha.js:4195:13
runTest@http://localhost:8001/node_modules/mocha/mocha.js:4661:13
http://localhost:8001/node_modules/mocha/mocha.js:4768:19
next@http://localhost:8001/node_modules/mocha/mocha.js:4581:16
http://localhost:8001/node_modules/mocha/mocha.js:4591:11
next@http://localhost:8001/node_modules/mocha/mocha.js:4523:16
http://localhost:8001/node_modules/mocha/mocha.js:4559:9
timeslice@http://localhost:8001/node_modules/mocha/mocha.js:12326:27

annotated error.stack:
**breadcrumb: annotateError@http://localhost:8001/dist/client/test/all.js:9781:33
makeError@http://localhost:8001/dist/client/test/all.js:9766:31
http://localhost:8001/dist/client/test/all.js:9784:29
callFn@http://localhost:8001/node_modules/mocha/mocha.js:4202:25
run@http://localhost:8001/node_modules/mocha/mocha.js:4195:13
runTest@http://localhost:8001/node_modules/mocha/mocha.js:4661:13
http://localhost:8001/node_modules/mocha/mocha.js:4768:19
next@http://localhost:8001/node_modules/mocha/mocha.js:4581:16
http://localhost:8001/node_modules/mocha/mocha.js:4591:11
next@http://localhost:8001/node_modules/mocha/mocha.js:4523:16
http://localhost:8001/node_modules/mocha/mocha.js:4559:9
timeslice@http://localhost:8001/node_modules/mocha/mocha.js:12326:27

pretty error:
{ [Error: user attempted something!]
  line: 9766,
  column: 31,
  sourceURL: 'http://localhost:8001/dist/client/test/all.js',
  user: 'username' }
**breadcrumb: annotateError@http://localhost:8001/dist/client/test/all.js:9781:33
makeError@http://localhost:8001/dist/client/test/all.js:9766:31
http://localhost:8001/dist/client/test/all.js:9784:29
callFn@http://localhost:8001/node_modules/mocha/mocha.js:4202:25
run@http://localhost:8001/node_modules/mocha/mocha.js:4195:13
runTest@http://localhost:8001/node_modules/mocha/mocha.js:4661:13
http://localhost:8001/node_modules/mocha/mocha.js:4768:19
next@http://localhost:8001/node_modules/mocha/mocha.js:4581:16
http://localhost:8001/node_modules/mocha/mocha.js:4591:11
next@http://localhost:8001/node_modules/mocha/mocha.js:4523:16
... (additional lines truncated)
```

# PhantomJS

via `phantomjs-prebuilt` 2.1.5

```
plain error.stack:
Error: user attempted something!
    at makeError (http://localhost:8001/dist/client/test/all.js:9773)
    at http://localhost:8001/dist/client/test/all.js:9786
    at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202)
    at http://localhost:8001/node_modules/mocha/mocha.js:4195
    at http://localhost:8001/node_modules/mocha/mocha.js:4661
    at http://localhost:8001/node_modules/mocha/mocha.js:4790
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4581)
    at http://localhost:8001/node_modules/mocha/mocha.js:4591
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4523)
    at http://localhost:8001/node_modules/mocha/mocha.js:4559
    at timeslice (http://localhost:8001/node_modules/mocha/mocha.js:12326)

annotated error.stack:
Error: user attempted something!
    at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9783)
    at makeError (http://localhost:8001/dist/client/test/all.js:9773)
    at http://localhost:8001/dist/client/test/all.js:9786
    at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202)
    at http://localhost:8001/node_modules/mocha/mocha.js:4195
    at http://localhost:8001/node_modules/mocha/mocha.js:4661
    at http://localhost:8001/node_modules/mocha/mocha.js:4790
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4581)
    at http://localhost:8001/node_modules/mocha/mocha.js:4591
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4523)
    at http://localhost:8001/node_modules/mocha/mocha.js:4559
    at timeslice (http://localhost:8001/node_modules/mocha/mocha.js:12326)

pretty error:
{ [Error: user attempted something!]
  line: 9773,
  sourceId: 210916128,
  sourceURL: 'http://localhost:8001/dist/client/test/all.js',
  stack: 'Error: user attempted something!\n    at makeError (http://localhost:8001/dist/client/test/all.js:9773)\n    at http://localhost:8001/dist/client/test/all.js:9786\n    at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202)\n    at http://localhost:8001/node_modules/mocha/mocha.js:4195\n    at http://localhost:8001/node_modules/mocha/mocha.js:4661\n    at http://localhost:8001/node_modules/mocha/mocha.js:4790\n    at next (http://localhost:8001/node_modules/mocha/mocha.js:4581)\n    at http://localhost:8001/node_modules/mocha/mocha.js:4591\n    at next (http://localhost:8001/node_modules/mocha/mocha.js:4523)\n    at http://localhost:8001/node_modules/mocha/mocha.js:4559\n    at timeslice (http://localhost:8001/node_modules/mocha/mocha.js:12326)',
  stackArray:
   [ { function: 'makeError',
       sourceURL: 'http://localhost:8001/dist/client/test/all.js',
       line: 9773 },
     { sourceURL: 'http://localhost:8001/dist/client/test/all.js',
       line: 9786 },
     { function: 'callFn',
       sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4202 },
     { sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4195 },
     { sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4661 },
     { sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4790 },
     { function: 'next',
       sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4581 },
     { sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4591 },
     { function: 'next',
       sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4523 },
     { sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 4559 },
     { function: 'timeslice',
       sourceURL: 'http://localhost:8001/node_modules/mocha/mocha.js',
       line: 12326 } ],
  user: 'username' }
    at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9783)
    at makeError (http://localhost:8001/dist/client/test/all.js:9773)
    at http://localhost:8001/dist/client/test/all.js:9786
    at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202)
    at http://localhost:8001/node_modules/mocha/mocha.js:4195
    at http://localhost:8001/node_modules/mocha/mocha.js:4661
    at http://localhost:8001/node_modules/mocha/mocha.js:4790
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4581)
    at http://localhost:8001/node_modules/mocha/mocha.js:4591
    at next (http://localhost:8001/node_modules/mocha/mocha.js:4523)
    ... (additional lines truncated)
```

# Microsoft Edge 13, Windows 10

```
plain error.stack:
Error: user attempted something!
   at makeError (http://localhost:8001/dist/client/test/all.js:9766:10)
   at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
   at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
   at Runnable.prototype.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
   at Runner.prototype.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4559:5)

annotated error.stack:
Error: user attempted something!
   at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:11)
   at makeError (http://localhost:8001/dist/client/test/all.js:9766:10)
   at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
   at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
   at Runnable.prototype.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
   at Runner.prototype.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4559:5)

pretty error:
{ [Error: user attempted something!] user: 'username', _description: 'user attempted something!' }
   at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:11)
   at makeError (http://localhost:8001/dist/client/test/all.js:9766:10)
   at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
   at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
   at Runnable.prototype.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
   at Runner.prototype.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
   ... (additional lines truncated)
```

# Internet Explorer 11, Windows 10

```
plain error.stack:
Error: user attempted something!
   at makeError (http://localhost:8001/dist/client/test/all.js:9771:14)
   at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
   at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
   at Runnable.prototype.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
   at Runner.prototype.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4559:5)

annotated error.stack:
Error: user attempted something!
   at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:11)
   at makeError (http://localhost:8001/dist/client/test/all.js:9771:14)
   at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
   at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
   at Runnable.prototype.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
   at Runner.prototype.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4559:5)

pretty error:
{ [Error: user attempted something!] user: 'username', _description: 'user attempted something!' }
   at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:11)
   at makeError (http://localhost:8001/dist/client/test/all.js:9771:14)
   at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
   at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
   at Runnable.prototype.run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
   at Runner.prototype.runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
   at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
   at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
   ... (additional lines truncated)
```

# Internet Explorer 10, Windows 7

```
plain error.stack:
Error: user attempted something!
  at makeError (http://localhost:8001/dist/client/test/all.js:9771:14)
  at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
  at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
  at run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
  at runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
  at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
  at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4559:5)

annotated error.stack:
Error: user attempted something!
  at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:11)
  at makeError (http://localhost:8001/dist/client/test/all.js:9771:14)
  at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
  at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
  at run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
  at runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
  at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
  at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4559:5)

pretty error:
{ [Error: user attempted something!] user: 'username', _description: 'user attempted something!' }
  at **breadcrumb: annotateError (http://localhost:8001/dist/client/test/all.js:9781:11)
  at makeError (http://localhost:8001/dist/client/test/all.js:9771:14)
  at Anonymous function (http://localhost:8001/dist/client/test/all.js:9784:8)
  at callFn (http://localhost:8001/node_modules/mocha/mocha.js:4202:5)
  at run (http://localhost:8001/node_modules/mocha/mocha.js:4195:7)
  at runTest (http://localhost:8001/node_modules/mocha/mocha.js:4661:5)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4768:7)
  at next (http://localhost:8001/node_modules/mocha/mocha.js:4581:7)
  at Anonymous function (http://localhost:8001/node_modules/mocha/mocha.js:4591:7)
  at next (http://localhost:8001/node_modules/mocha/mocha.js:4523:7)
  ... (additional lines truncated)
```

