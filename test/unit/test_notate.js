import { expect } from 'chai';

import {
  justNotate,
  prettyPrint,
  _isFunction,
  _insert,
  _prepareStack,
  _getFirstLine,
  _getIndentation,
} from 'src/notate';


const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

describe('unit/notate', () => {
  // Public API
  // ========

  describe('#prettyPrint', () => {
    let err;

    beforeEach(() => {
      err = new Error('this is the message');
      err.one = 1;
      err.two = 'two';

      Object.defineProperty(err, 'stack', {
        value: 'overridden stack',
        enumerable: false,
        configurable: true,
        writable: true,
      });
    });

    it('includes callstack when log is not set', () => {
      const actual = prettyPrint(err);

      expect(actual).to.contain(err.stack);
    });

    it('include callstack if log is "error"', () => {
      err.log = 'error';

      const actual = prettyPrint(err);

      expect(actual).to.contain(err.stack);
    });

    it('include callstack if log is "warn"', () => {
      err.log = 'warn';

      const actual = prettyPrint(err);

      expect(actual).to.contain(err.stack);
    });

    it('does not include callstack if log is "info"', () => {
      err.log = 'info';

      const actual = prettyPrint(err);

      expect(actual).not.to.contain(err.stack);
    });

    it('truncates callstack at 10 lines by default', () => {
      err.stack = 'line 1\n'
        + 'line 2\n'
        + 'line 3\n'
        + 'line 4\n'
        + 'line 5\n'
        + 'line 6\n'
        + 'line 7\n'
        + 'line 8\n'
        + 'line 9\n'
        + 'line 10\n'
        + 'line 11';

      const expected = '{ [Error: this is the message] one: 1, two: \'two\' }\n'
        + 'line 1\n'
        + 'line 2\n'
        + 'line 3\n'
        + 'line 4\n'
        + 'line 5\n'
        + 'line 6\n'
        + 'line 7\n'
        + 'line 8\n'
        + 'line 9\n'
        + 'line 10\n'
        + '... (additional lines truncated)';

      const actual = prettyPrint(err);

      expect(actual).to.equal(expected);
    });

    it('truncates callstack at five lines when specified', () => {
      err.stack = 'line 1\n'
        + 'line 2\n'
        + 'line 3\n'
        + 'line 4\n'
        + 'line 5\n'
        + 'line 6\n'
        + 'line 7\n'
        + 'line 8\n'
        + 'line 9\n'
        + 'line 10\n'
        + 'line 11';

      const expected = '{ [Error: this is the message] one: 1, two: \'two\' }\n'
        + 'line 1\n'
        + 'line 2\n'
        + 'line 3\n'
        + 'line 4\n'
        + 'line 5\n'
        + '... (additional lines truncated)';

      const options = {
        maxLines: 5,
      };

      const actual = prettyPrint(err, options);

      expect(actual).to.equal(expected);
    });

    it('prints out whole object if it is not an Error', () => {
      err = {
        message: 'this is the message',
        stack: 'overridden stack',
        one: 1,
        two: 'two',
      };

      const actual = prettyPrint(err);

      expect(actual).to.contain('message:');
      expect(actual).to.contain('stack:');
      expect(actual).to.contain('one:');
      expect(actual).to.contain('two:');
    });

    it('does not include message if it is enumerable', () => {
      Object.defineProperty(err, 'message', {
        value: 'this is the message',
        enumerable: true,
        configurable: true,
      });

      expect(propertyIsEnumerable.call(err, 'message')).to.equal(true);

      const actual = prettyPrint(err);

      expect(actual).to.contain('one:');
      expect(actual).to.contain('two:');

      expect(actual).not.to.contain('message:');
      expect(propertyIsEnumerable.call(err, 'message')).to.equal(false);
    });

    it('moves description field to _description', () => {
      err.description = 'description';

      const actual = prettyPrint(err);

      expect(actual).to.contain('_description:');
    });

    it('returns empty string if err is null', () => {
      const actual = prettyPrint();

      expect(actual).to.equal('');
    });

    it('handles an annotated non-vanilla error', () => {
      const err = new TypeError('something');
      justNotate(err);
      const actual = prettyPrint(err);

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

  describe('#isFunction', () => {
    it('returns false for falsey parameter', () => {
      expect(_isFunction()).to.equal(false);
      expect(_isFunction(null)).to.equal(false);
      expect(_isFunction('')).to.equal(false);
    });

    it('returns false for object parameter', () => {
      expect(_isFunction({})).to.equal(false);
    });

    it('returns false for other types', () => {
      expect(_isFunction(/regex/)).to.equal(false);
      expect(_isFunction('string')).to.equal(false);
      expect(_isFunction(5)).to.equal(false);
      expect(_isFunction(new Date())).to.equal(false);
    });

    it('returns true if it is a function', () => {
      expect(_isFunction(() => {})).to.equal(true);
      expect(_isFunction(it)).to.equal(true);
    });
  });

  describe('#_insert', () => {
    it('puts current file into stack', () => {
      const err = {
        stack: 'Error: something\n'
          + '    at line 1\n'
          + '    at line 2',
      };
      const item = 'randomString';

      _insert(err, item);

      expect(err).to.have.property('stack').that.contains(item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '    at randomString');
    });

    it('matches current indentation', () => {
      const err = {
        stack: 'Error: something\n'
          + '  at line 1\n'
          + '  at line 2',
      };
      const item = 'randomString';

      _insert(err, item);

      expect(err).to.have.property('stack').that.contains(item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '  at randomString');
    });

    it('handles err with no " at " lines', () => {
      const err = {
        stack: 'some random text',
      };
      const item = 'randomString';

      _insert(err, item);

      expect(err).to.have.property('stack').that.contains(item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('0', 'randomString');
    });

    it('handles firefox-style callstack', () => {
      const err = {
        stack:
          'makeError@http://localhost:8000/dist/client/test/all.js:9408:17\n'
          + '@http://localhost:8000/dist/client/test/all.js:9415:20\n'
          + 'callFn@http://localhost:8000/node_modules/mocha/mocha.js:4202:18\n'
          + '[35]</</Runnable.prototype.run@http://localhost:8000/node_modules/mocha/mocha.js:4195:7\n'
          + '[36]</</Runner.prototype.runTest@http://localhost:8000/node_modules/mocha/mocha.js:4661:5\n'
          + 'next/<@http://localhost:8000/node_modules/mocha/mocha.js:4768:7\n'
          + 'next@http://localhost:8000/node_modules/mocha/mocha.js:4581:1\n'
          + 'next/<@http://localhost:8000/node_modules/mocha/mocha.js:4591:7\n'
          + 'next@http://localhost:8000/node_modules/mocha/mocha.js:4523:1\n'
          + '[36]</</Runner.prototype.hook/<@http://localhost:8000/node_modules/mocha/mocha.js:4559:5\n'
          + 'timeslice@http://localhost:8000/node_modules/mocha/mocha.js:12326:5',
      };
      const item = 'randomString';

      _insert(err, item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property(0, item);
    });

    it('handles Chrome-style callstack', () => {
      const err = {
        stack:
          'Error: user attempted something!\n'
          + '    at makeError (test_js:14)\n'
          + '    at Context.<anonymous> (test_js:21)\n'
          + '    at callFn (mocha.js:4202)\n'
          + '    at Test.Runnable.run (mocha.js:4195)\n'
          + '    at Runner.runTest (mocha.js:4661)\n'
          + '    at mocha.js:4768\n'
          + '    at next (mocha.js:4581)\n'
          + '    at mocha.js:4591\n'
          + '    at next (mocha.js:4523)\n'
          + '    at mocha.js:4559',
      };
      const item = 'randomString';

      _insert(err, item);

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', `    at ${item}`);
    });

    it('does alright with error with \'at\' in message', () => {
      const err = {
        stack: 'Error: at or near ";"\n'
          + '  at line 1\n'
          + '  at line 2',
      };
      const item = 'randomString';

      _insert(err, item);

      expect(err).to.have.property('stack').that.contains('randomString');

      const lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '  at randomString');
    });

    it('sets alternateStack if err.stack is not writeable', () => {
      const err = Object.create(null);
      Object.defineProperty(err, 'stack', {
        writable: false,
        value: 'something',
      });

      const line = 'inserted line';

      _insert(err, line);

      expect(err).to.have.property('alternateStack').that.contains(line);
      expect(err).to.have.property('stack').not.that.contains(line);
    });

    it('fixes stack property if it is configurable but not writeable', () => {
      const err = Object.create(null);
      Object.defineProperty(err, 'stack', {
        writable: false,
        enumerable: true,
        configurable: true,
        value: 'something',
      });
      const expected = 'inserted line\nsomething';
      const line = 'inserted line';

      _insert(err, line);

      expect(err).to.have.property('stack', expected);

      const descriptor = Object.getOwnPropertyDescriptor(err, 'stack');
      expect(descriptor).to.have.property('enumerable', false);
    });

    it('handles no err', () => {
      _insert();
    });

    it('handles no stack', () => {
      const err = {
        stack: null,
      };

      _insert(err, 'line');

      expect(err.stack).to.equal('line');
    });
  });

  describe('#_prepareStack', () => {
    it('removes everything up to first at "Error:"', () => {
      const err = {
        stack: 'Error: error message\nsecond part of error\nthird part of error\n'
          + '  at second line\n'
          + '  at third line',
      };
      const expected = '  at second line\n'
        + '  at third line';

      const actual = _prepareStack(err);
      expect(actual).to.equal(expected);
    });

    it('doesn\'t remove first line if no "Error"', () => {
      const err = {
        stack:
          '  at second line\n'
          + '  at third line',
      };

      const actual = _prepareStack(err);
      expect(actual).to.equal(err.stack);
    });

    it('prefers alternateStack if it exists on object', () => {
      const err = {
        alternateStack: '  **breadcrumb: blah',
        stack: '  at second line\n'
          + '  at third line',
      };

      const actual = _prepareStack(err);
      expect(actual).to.equal(err.alternateStack);
    });

    if (process.cwd() !== '/') {
      it('removes process.cwd()', () => {
        const err = {
          stack: `${process.cwd()}line1${process.cwd()}line2${process.cwd()}`,
        };

        const actual = _prepareStack(err);
        expect(actual).to.equal('line1line2');
      });
    }
  });

  describe('#_getFirstLine', () => {
    it('removes " at " at start of breadcrumb', () => {
      const lines = ['   at blah'];
      const actual = _getFirstLine(lines);

      expect(actual).to.equal('**breadcrumb: blah');
    });

    it('handles a no "at" breadcrumb', () => {
      const lines = ['blah'];
      const actual = _getFirstLine(lines);

      expect(actual).to.equal('**breadcrumb: blah');
    });

    it('empty returned if no stacktrace', () => {
      const lines = [];
      const actual = _getFirstLine(lines);

      expect(actual).to.equal('**breadcrumb: <empty>');
    });
  });

  describe('#_getIndentation', () => {
    it('handles no indentation', () => {
      expect(_getIndentation('blah')).to.equal('');
    });

    it('handles four-space indentation', () => {
      expect(_getIndentation('    blah')).to.equal('    ');
    });

    it('handles two-space indentation', () => {
      expect(_getIndentation('  blah')).to.equal('  ');
    });

    it('multiline input', () => {
      expect(_getIndentation('Error: something\n  at blah')).to.equal('  ');
    });

    it('returns empty string for null input', () => {
      expect(_getIndentation()).to.equal('');
    });

    it('returns empty string for non-string', () => {
      expect(_getIndentation(3)).to.equal('');
    });
  });
});
