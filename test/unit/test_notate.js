import { expect } from 'chai';

import * as notate from 'src/notate.js';


describe('unit/notate', function() {
  // Public API
  // ========

  describe('#prettyPrint', function() {
    let err;

    beforeEach(function() {
      err = new Error('this is the message');
      err.one = 1;
      err.two = 'two';

      Object.defineProperty(err, 'stack', {
        value: 'overridden stack',
        enumerable: false
      });
    });

    it('includes callstack when log is not set', function() {
      const actual = notate.prettyPrint(err);

      expect(actual).to.contain(err.stack);
    });

    it('include callstack if log is "error"', function() {
      err.log = 'error';

      const actual = notate.prettyPrint(err);

      expect(actual).to.contain(err.stack);
    });

    it('include callstack if log is "warn"', function() {
      err.log = 'warn';

      const actual = notate.prettyPrint(err);

      expect(actual).to.contain(err.stack);
    });

    it('does not include callstack if log is "info"', function() {
      err.log = 'info';

      const actual = notate.prettyPrint(err);

      expect(actual).not.to.contain(err.stack);
    });

    it('prints out whole object if it is not an Error', function() {
      err = {
        message: 'this is the message',
        stack: 'overridden stack',
        one: 1,
        two: 'two'
      };

      const actual = notate.prettyPrint(err);

      expect(actual).to.contain('message:');
      expect(actual).to.contain('stack:');
      expect(actual).to.contain('one:');
      expect(actual).to.contain('two:');
    });

    it('does not include message if it is enumerable', function() {
      Object.defineProperty(err, 'message', {
        value: 'this is the message',
        enumerable: true,
        configurable: true
      });

      expect(err.propertyIsEnumerable('message')).to.equal(true);

      const actual = notate.prettyPrint(err);

      expect(actual).to.contain('one:');
      expect(actual).to.contain('two:');

      expect(actual).not.to.contain('message:');
      expect(err.propertyIsEnumerable('message')).to.equal(false);
    });

    it('moves description field to _description', function() {
      err.description = 'description';

      const actual = notate.prettyPrint(err);

      expect(actual).to.contain('_description:');
    });

    it('returns empty string if err is null', function() {
      const actual = notate.prettyPrint();

      expect(actual).to.equal('');
    });

    it('handles an annotated non-vanilla error', function() {
      const err = new TypeError('something');
      notate.default(err);
      const actual = notate.prettyPrint(err);

      const r = /TypeError/g;
      const match = actual.match(r);
      if (!match) {
        return;
      }
      expect(match).to.have.property('length').that.is.below(2);
    });
  });

  // Internals
  // ========

  describe('#_insert', function() {
    it('puts current file into stack', function() {
      const err = {
        stack: 'Error: something\n' +
          '    at line 1\n' +
          '    at line 2'
      };
      const item = 'randomString';

      notate._insert(err, item);

      expect(err).to.have.property('stack').that.contains(item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '    at randomString');
    });

    it('matches current indentation', function() {
      const err = {
        stack: 'Error: something\n' +
          '  at line 1\n' +
          '  at line 2'
      };
      const item = 'randomString';

      notate._insert(err, item);

      expect(err).to.have.property('stack').that.contains(item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '  at randomString');
    });

    it('handles err with no " at " lines', function() {
      const err = {
        stack: 'some random text'
      };
      const item = 'randomString';

      notate._insert(err, item);

      expect(err).to.have.property('stack').that.contains(item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('0', 'randomString');
    });

    it('handles firefox-style callstack', function() {
      const err = {
        stack:
          'makeError@http://localhost:8000/dist/client/test/all.js:9408:17\n' +
          '@http://localhost:8000/dist/client/test/all.js:9415:20\n' +
          'callFn@http://localhost:8000/node_modules/mocha/mocha.js:4202:18\n' +
          '[35]</</Runnable.prototype.run@http://localhost:8000/node_modules/mocha/mocha.js:4195:7\n' +
          '[36]</</Runner.prototype.runTest@http://localhost:8000/node_modules/mocha/mocha.js:4661:5\n' +
          'next/<@http://localhost:8000/node_modules/mocha/mocha.js:4768:7\n' +
          'next@http://localhost:8000/node_modules/mocha/mocha.js:4581:1\n' +
          'next/<@http://localhost:8000/node_modules/mocha/mocha.js:4591:7\n' +
          'next@http://localhost:8000/node_modules/mocha/mocha.js:4523:1\n' +
          '[36]</</Runner.prototype.hook/<@http://localhost:8000/node_modules/mocha/mocha.js:4559:5\n' +
          'timeslice@http://localhost:8000/node_modules/mocha/mocha.js:12326:5'
      };
      const item = 'randomString';

      notate._insert(err, item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property(0, item);
    });

    it('handles Chrome-style callstack', function() {
      const err = {
        stack:
          'Error: user attempted something!\n' +
          '    at makeError (test_notate.js:14)\n' +
          '    at Context.<anonymous> (test_notate.js:21)\n' +
          '    at callFn (mocha.js:4202)\n' +
          '    at Test.Runnable.run (mocha.js:4195)\n' +
          '    at Runner.runTest (mocha.js:4661)\n' +
          '    at mocha.js:4768\n' +
          '    at next (mocha.js:4581)\n' +
          '    at mocha.js:4591\n' +
          '    at next (mocha.js:4523)\n' +
          '    at mocha.js:4559'
      };
      const item = 'randomString';

      notate._insert(err, item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '    at ' + item);
    });

    it('does alright with error with \'at\' in message', function() {
      const err = {
        stack: 'Error: at or near ";"\n' +
          '  at line 1\n' +
          '  at line 2'
      };
      const item = 'randomString';

      notate._insert(err, item);

      expect(err).to.have.property('stack').that.contains('randomString');

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '  at randomString');
    });

    it('sets alternateStack if err.stack is not writeable', function() {
      const err = Object.create(null);
      Object.defineProperty(err, 'stack', {
        writable: false,
        value: 'something'
      });

      const line = 'inserted line';

      notate._insert(err, line);

      expect(err).to.have.property('alternateStack').that.contains(line);
      expect(err).to.have.property('stack').not.that.contains(line);
    });

    it('fixes stack property if it is enumerable/configurable', function() {
      const err = Object.create(null);
      Object.defineProperty(err, 'stack', {
        writable: true,
        enumerable: true,
        configurable: true,
        value: 'something'
      });
      const expected = 'inserted line\nsomething';
      const line = 'inserted line';

      notate._insert(err, line);

      expect(err).to.have.property('stack', expected);

      const descriptor = Object.getOwnPropertyDescriptor(err, 'stack');
      expect(descriptor).to.have.property('enumerable', false);
    });

    it('handles no err', function() {
      notate._insert();
    });

    it('handles no stack', function() {
      const err = {
        stack: null
      };

      notate._insert(err, 'line');

      expect(err.stack).to.equal('line');
    });
  });

  describe('#_prepareStack', function() {
    it('removes everything up to first at "Error:"', function() {
      const err = {
        stack: 'Error: error message\nsecond part of error\nthird part of error\n' +
          '  at second line\n' +
          '  at third line'
      };
      const expected =
        '  at second line\n' +
        '  at third line';

      const actual = notate._prepareStack(err);
      expect(actual).to.equal(expected);
    });

    it('doesn\'t remove first line if no "Error"', function() {
      const err = {
        stack:
          '  at second line\n' +
          '  at third line'
      };

      const actual = notate._prepareStack(err);
      expect(actual).to.equal(err.stack);
    });

    it('prefers alternateStack if it exists on object', function() {
      const err = {
        alternateStack:
          '  **breadcrumb: blah',
        stack:
          '  at second line\n' +
          '  at third line'
      };

      const actual = notate._prepareStack(err);
      expect(actual).to.equal(err.alternateStack);
    });

    if (process.cwd() !== '/') {
      it('removes process.cwd()', function() {
        const err = {
          stack: process.cwd() + 'line1' + process.cwd() + 'line2' + process.cwd()
        };

        const actual = notate._prepareStack(err);
        expect(actual).to.equal('line1line2');
      });
    }
  });

  describe('#_getFirstLine', function() {
    it('removes " at " at start of breadcrumb', function() {
      const lines = ['   at blah'];
      const actual = notate._getFirstLine(lines);

      expect(actual).to.equal('**breadcrumb: blah');
    });

    it('handles a no "at" breadcrumb', function() {
      const lines = ['blah'];
      const actual = notate._getFirstLine(lines);

      expect(actual).to.equal('**breadcrumb: blah');
    });

    it('empty returned if no stacktrace', function() {
      const lines = [];
      const actual = notate._getFirstLine(lines);

      expect(actual).to.equal('**breadcrumb: <empty>');
    });
  });

  describe('#_getIndentation', function() {
    it('handles no indentation', function() {
      expect(notate._getIndentation('blah')).to.equal('');
    });

    it('handles four-space indentation', function() {
      expect(notate._getIndentation('    blah')).to.equal('    ');
    });

    it('handles two-space indentation', function() {
      expect(notate._getIndentation('  blah')).to.equal('  ');
    });

    it('multiline input', function() {
      expect(notate._getIndentation('Error: something\n  at blah')).to.equal('  ');
    });

    it('returns empty string for null input', function() {
      expect(notate._getIndentation()).to.equal('');
    });

    it('returns empty string for non-string', function() {
      expect(notate._getIndentation(3)).to.equal('');
    });
  });
});
