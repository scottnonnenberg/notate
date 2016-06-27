import { expect } from 'chai';
import sinon from 'sinon';

import {
  default as notate,
  justNotate,
  prettyPrint,
  _getStackTrace,
} from 'src/notate';


describe('integration/notate', () => {
  // Public API
  // =======

  describe('complete scenario', () => {
    it('works', () => {
      function makeError() {
        let error = new Error('user attempted something!');

        // fuck internet explorer
        if (!error.stack) {
          try {
            throw error;
          }
          catch (e) {
            error = e;
          }
        }

        return error;
      }

      function annotateError(err) {
        justNotate(err, { user: 'username' });
      }

      const error = makeError();

      if (typeof console !== 'undefined' && console && console.log) {
        console.log('plain error.stack:');
        console.log(error.alternateStack || error.stack);
      }

      annotateError(error);
      if (typeof console !== 'undefined' && console && console.log) {
        console.log('annotated error.stack:');
        console.log(error.alternateStack || error.stack);
      }

      const pretty = prettyPrint(error);
      if (typeof console !== 'undefined' && console && console.log) {
        console.log('pretty error:');
        console.log(pretty);
      }

      const lines = pretty.split('\n');
      expect(lines).to.have.length.above(10);

      expect(pretty).to.include('makeError');
      expect(pretty).to.include('annotateError');
      expect(pretty).to.include('username');
      expect(pretty).to.include('user attempted something');
      expect(pretty).to.include('truncated');
    });
  });

  describe('#justNotate', () => {
    it('adds current file into error\'s stack', function addCurrent() {
      let err = new Error('something');

      // fuck internet explorer
      if (!err.stack) {
        try {
          throw err;
        }
        catch (e) {
          err = e;
        }
      }

      justNotate(err, { left: 1, right: 2 });

      const stack = err.alternateStack || err.stack;
      expect(stack).to.contain('addCurrent');

      const lines = stack.split('\n');
      const firstLine = lines[0] === 'Error: something' ? 1 : 0;
      expect(lines[firstLine]).to.contain('**notate:');
      expect(lines[firstLine]).to.contain('addCurrent');
      expect(lines[firstLine + 1]).not.to.contain('**notate:');
      expect(lines[firstLine + 1]).to.contain('addCurrent');
    });

    it('adds current file into error\'s stack - empty message', function addCurrent() {
      let err = new Error();

      // fuck internet explorer
      if (!err.stack) {
        try {
          throw err;
        }
        catch (e) {
          err = e;
        }
      }

      justNotate(err, { left: 1, right: 2 });

      const stack = err.alternateStack || err.stack;
      expect(stack).to.contain('addCurrent');

      const lines = stack.split('\n');
      const firstLine = lines[0] === 'Error' || lines[0] === 'Error: ' ? 1 : 0;
      expect(lines[firstLine]).to.contain('**notate:');
      expect(lines[firstLine]).to.contain('addCurrent');
      expect(lines[firstLine + 1]).not.to.contain('**notate:');
      expect(lines[firstLine + 1]).to.contain('addCurrent');
    });

    it('can be run more than once', function twice() {
      let err = new Error();

      // fuck internet explorer
      if (!err.stack) {
        try {
          throw err;
        }
        catch (e) {
          err = e;
        }
      }

      function first(err) {
        justNotate(err);
      }

      function second(err) {
        justNotate(err);
      }

      first(err);
      second(err);

      const stack = err.alternateStack || err.stack;

      expect(stack).to.contain('twice');
      expect(stack).to.contain('first');
      expect(stack).to.contain('second');
    });

    it('merges keys into error', () => {
      const err = new Error();
      justNotate(err, { left: 1, right: 2 });

      expect(err).to.have.property('left', 1);
      expect(err).to.have.property('right', 2);
    });

    it('does not overwrite message', () => {
      const err = new Error('original message');
      justNotate(err, { message: 'new message' });

      expect(err).to.have.property('message', 'original message');
    });

    it('does just fine with no err', () => {
      justNotate();
    });
  });

  describe('#notate (default)', () => {
    it('calls callback and returns true if err provided', () => {
      const cb = sinon.stub();
      const actual = notate(cb, new Error());

      expect(actual).to.equal(true);
      expect(cb).to.have.property('callCount', 1);
    });

    it('does not call callback and returns false if err provided', () => {
      const cb = sinon.stub();
      const actual = notate(cb, null);

      expect(actual).to.equal(false);
      expect(cb).to.have.property('callCount', 0);
    });

    it('throws if cb is not a function', () => {
      const cb = 5;

      expect(() => {
        notate(cb, null);
      }).to.throw(Error)
        .that.has.property(
          'message',
          'notate: provided first parameter cb was not a function'
        );
    });
  });

  // Internals
  // =======

  describe('#_getStackTrace', () => {
    it('returns the current line for first line', function currentLine() {
      const lines = _getStackTrace();

      expect(lines).to.have.property('0').that.contains('currentLine');
    });
  });
});
