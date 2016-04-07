'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var Notate = require('src/notate.js');


describe('unit/notate', function() {
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

  describe('#toString', function() {
    var err;

    beforeEach(function() {
      err = new Error('this is the message');
      err.one = 1;
      err.two = 'two';
      err.stack = 'overridden stack';
    });

    it('returns empty string if err is null', function() {
      var actual = notate.toString();

      expect(actual).to.equal('');
    });

    it('handles a non-vanilla error', function() {
      var err = new TypeError('something');
      notate.add(err);
      var actual = notate.toString(err);
      console.log(actual);

      var r = /TypeError/g;
      var match = actual.match(r);
      if (!match) {
        return;
      }
      expect(match).to.have.property('length').that.is.below(2);
    });

    it('includes callstack when log is not set', function() {
      var actual = notate.toString(err);

      expect(actual).to.match(/overridden stack/);
    });

    it('include callstack if log is "error"', function() {
      err.log = 'error';

      var actual = notate.toString(err);

      expect(actual).to.match(/overridden stack/);
    });

    it('include callstack if log is "warn"', function() {
      err.log = 'warn';

      var actual = notate.toString(err);

      expect(actual).to.match(/overridden stack/);
    });

    it('does not include callstack if log is "info"', function() {
      err.log = 'info';

      var actual = notate.toString(err);

      expect(actual).not.to.match(/overridden stack/);
    });
  });

  // Helper functions
  // ========

  describe('#_insert', function() {
    var toInsert;

    beforeEach(function() {
      toInsert = 'randomString';
      notate._get = sinon.stub().returns(toInsert);
    });

    it('puts current file into stack', function() {
      var err = {
        stack: 'Error: something\n' +
          '  at line 1\n' +
          '  at line 2\n'
      };
      notate._insert(err);

      expect(err).to.have.property('stack').that.match(/randomString/);
      var lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '  at randomString');
    });

    it('does just fine with an err with no " at " lines', function() {
      var err = {
        stack: 'some random text'
      };
      notate._insert(err);

      expect(err).to.have.property('stack').that.match(/randomString/);
      var lines = err.stack.split('\n');
      expect(lines).to.have.property('0', 'randomString');
    });

    it('does alright with error with \'at\' in message', function() {
      var err = {
        stack: 'Error: at or near ";"\n' +
          '  at line 1\n' +
          '  at line 2'
      };
      notate._insert(err);

      console.log(err.stack);
      expect(err).to.have.property('stack').that.match(/randomString/);
      var lines = err.stack.split('\n');
      expect(lines).to.have.property('1', '  at randomString');
    });

    it('does not throw if err.stack is not writeable', function() {
      var err = Object.create(null);
      Object.defineProperty(err, 'stack', {
        writable: false,
        value: 'something'
      });

      notate._insert(err);
    });

    it('does just fine with no err', function() {
      notate._insert();
    });
  });

  describe('#_prepareStack', function() {
    it('removes everything up to first at "Error:"', function() {
      var err = {
        stack: 'Error: error message\nsecond part of error\nthird part of error\n' +
          '  at second line\n' +
          '  at third line'
      };
      var expected = '  at second line\n' +
          '  at third line';

      var actual = notate._prepareStack(err);
      expect(actual).to.equal(expected);
    });

    it('doesn\'t remove first line if no "Error"', function() {
      var err = {
        stack: '  at second line\n' +
          '  at third line'
      };

      var actual = notate._prepareStack(err);
      expect(actual).to.equal(err.stack);
    });

    if (typeof process !== 'undefined') {
      it('removes process.cwd()', function() {
        var err = {
          stack: process.cwd() + '  ' + process.cwd() + '  ' + process.cwd()
        };

        var actual = notate._prepareStack(err);
        expect(actual).to.equal('    ');
      });
    }
  });
});
