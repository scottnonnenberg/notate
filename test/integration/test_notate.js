import { expect } from 'chai';
import sinon from 'sinon';

import Notate from 'src/notate';


describe('integration/notate', function() {
  var notate;

  beforeEach(function() {
    notate = new Notate();
  });

  // Public API
  // ========

  if (typeof console === 'undefined' || typeof console.log === 'undefined') {
    window.console = {
      log: function() {}
    };
  }

  describe('#newError', function() {
    it('is well-formed', function wellFormed() {
      var err = notate.newError('random', {x: 1, y: 2});
      console.log(err.stack);

      var message = err.message || err.description;
      expect(message).to.equal('random');

      expect(err).to.have.property('x', 1);
      expect(err).to.have.property('y', 2);

      var stack = err.stack;
      expect(stack).to.exist;
      expect(stack).to.match(/wellFormed/);

      var lines = stack.split('\n');
      if (lines[0] === 'Error: random') {
        expect(lines[1]).to.match(/wellFormed/);
      }
      else {
        expect(lines[0]).to.match(/wellFormed/);
      }
    });
  });

  describe('#add', function() {
    it('adds current file into error\'s stack', function addCurrent() {
      var err = notate.newError('something');
      notate.add(err, null, {left: 1, right: 2});

      console.log(err.stack);
      expect(err).to.have.property('stack').that.match(/addCurrent/);

      var lines = err.stack.split('\n');

      if (lines[0] === 'Error: something') {
        expect(lines[1]).to.match(/\*\*breadcrumb:/);
        expect(lines[1]).to.match(/addCurrent/);
        expect(lines[2]).not.to.match(/\*\*breadcrumb:/);
        expect(lines[2]).to.match(/addCurrent/);
      }
      else {
        expect(lines[0]).to.match(/\*\*breadcrumb:/);
        expect(lines[0]).to.match(/addCurrent/);
        expect(lines[1]).not.to.match(/\*\*breadcrumb:/);
        expect(lines[1]).to.match(/addCurrent/);
      }
    });

    it('merges keys into error', function() {
      var err = new Error();
      notate.add(err, null, {left: 1, right: 2});

      expect(err).to.have.property('left', 1);
      expect(err).to.have.property('right', 2);
    });

    it('does not overwrite message', function() {
      var err = new Error('original message');
      notate.add(err, null, {message: 'new message'});

      expect(err).to.have.property('message', 'original message');
    });

    it('does just fine with no err', function() {
      notate.add();
    });

    it('calls callback and returns true if err provided', function() {
      var cb = sinon.stub();
      var actual = notate.add({}, cb);

      expect(actual).to.equal(true);
      expect(cb).to.have.property('callCount', 1);
    });

    it('does not call callback and returns false if err provided', function() {
      var cb = sinon.stub();
      var actual = notate.add(null, cb);

      expect(actual).to.equal(false);
      expect(cb).to.have.property('callCount', 0);
    });
  });

  // Helper functions
  // ========

  describe('#_get', function() {
    it('returns the current line', function currentLine() {
      var actual = notate._get();
      console.log(actual);

      expect(actual).to.match(/currentLine/);
    });

    it('removes " at " at start of breadcrumb', function() {
      notate._getStackTrace = sinon.stub().returns(['   at blah']);
      var actual = notate._get();
      expect(actual).to.equal('**breadcrumb: blah');
    });

    it('handles a no " at " breadcrumb', function() {
      notate._getStackTrace = sinon.stub().returns(['blah']);
      var actual = notate._get();
      expect(actual).to.equal('**breadcrumb: blah');
    });

    it('empty returned if no stacktrace', function() {
      notate._getStackTrace = sinon.stub().returns([]);
      var actual = notate._get();
      expect(actual).to.equal('**breadcrumb: <empty>');
    });
  });
});
