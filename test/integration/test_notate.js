import { expect } from 'chai';
import sinon from 'sinon';

import * as notate from 'src/notate';


describe('integration/notate', function() {
  // Public API
  // =======

  describe('complete scenario', function() {
    it('works', function() {
      const makeError = function() {
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
      };

      const annotateError = function(err) {
        notate.default(err, null, {user: 'username'});
      };

      const error = makeError();

      if (typeof console === 'undefined' || console || console.log) {
        console.log('plain error.stack:');
        console.log(error.alternateStack || error.stack);
      }

      annotateError(error);
      if (typeof console === 'undefined' || console || console.log) {
        console.log('annotated error.stack:');
        console.log(error.alternateStack || error.stack);
      }

      const pretty = notate.prettyPrint(error);
      if (typeof console === 'undefined' || console || console.log) {
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

  describe('#notate (default)', function() {
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

      notate.default(err, null, {left: 1, right: 2});

      const stack = err.alternateStack || err.stack;
      expect(stack).to.contain('addCurrent');

      const lines = stack.split('\n');
      const firstLine = (lines[0] === 'Error: something') ? 1 : 0;
      expect(lines[firstLine]).to.contain('**breadcrumb:');
      expect(lines[firstLine]).to.contain('addCurrent');
      expect(lines[firstLine + 1]).not.to.contain('**breadcrumb:');
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

      notate.default(err, null, {left: 1, right: 2});

      const stack = err.alternateStack || err.stack;
      expect(stack).to.contain('addCurrent');

      const lines = stack.split('\n');
      const firstLine = (lines[0] === 'Error' || lines[0] === 'Error: ') ? 1 : 0;
      expect(lines[firstLine]).to.contain('**breadcrumb:');
      expect(lines[firstLine]).to.contain('addCurrent');
      expect(lines[firstLine + 1]).not.to.contain('**breadcrumb:');
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

      const first = function(err) {
        notate.default(err);
      };

      const second = function(err) {
        notate.default(err);
      };

      first(err);
      second(err);

      const stack = err.alternateStack || err.stack;

      expect(stack).to.contain('twice');
      expect(stack).to.contain('first');
      expect(stack).to.contain('second');
    });

    it('merges keys into error', function() {
      const err = new Error();
      notate.default(err, null, {left: 1, right: 2});

      expect(err).to.have.property('left', 1);
      expect(err).to.have.property('right', 2);
    });

    it('does not overwrite message', function() {
      const err = new Error('original message');
      notate.default(err, null, {message: 'new message'});

      expect(err).to.have.property('message', 'original message');
    });

    it('does just fine with no err', function() {
      notate.default();
    });

    it('calls callback and returns true if err provided', function() {
      const cb = sinon.stub();
      const actual = notate.default({}, cb);

      expect(actual).to.equal(true);
      expect(cb).to.have.property('callCount', 1);
    });

    it('does not call callback and returns false if err provided', function() {
      const cb = sinon.stub();
      const actual = notate.default(null, cb);

      expect(actual).to.equal(false);
      expect(cb).to.have.property('callCount', 0);
    });
  });

  // Internals
  // =======

  describe('#_getStackTrace', function() {
    it('returns the current line for first line', function currentLine() {
      const lines = notate._getStackTrace();

      expect(lines).to.have.property('0').that.contains('currentLine');
    });
  });
});
