'use strict';

var assert = require('assert');
var defaultParsers = require('../../lib/defaultParsers');

describe('defaultParsers', () => {
  describe('default', () => {
    it('calls toString on the given value, and returns the result', () => {
      var value = {
        toString: function() {
          return 'to-string-result';
        }
      }

      assert.equal(defaultParsers.get('default')(value), 'to-string-result');
    });
  });

  describe('String', () => {
    it('calls toString on the given value, and returns the result', () => {
      var value = {
        toString: function() {
          return 'to-string-result';
        }
      }

      assert.equal(defaultParsers.get('default')(value), 'to-string-result');
    });
  });

  describe('Boolean', () => {
    it('returns true if the value is "true"', () => {
      assert.strictEqual(defaultParsers.get(Boolean)('true'), true);
    });

    it('returns true if the value is true', () => {
      assert.strictEqual(defaultParsers.get(Boolean)(true), true);
    });

    it('returns false if the value is falsey', () => {
      assert.strictEqual(defaultParsers.get(Boolean)(undefined), false);
    });
  });

  describe('Number', () => {
    it('returns a number', () => {
      assert.strictEqual(defaultParsers.get(Number)(12.34), 12.34);
    });

    it('destringifies an integer', () => {
      assert.strictEqual(defaultParsers.get(Number)('12'), 12);
    });

    it('destringifies a decimal', () => {
      assert.strictEqual(defaultParsers.get(Number)('12.34'), 12.34);
    });

    it('destringifies other things to NaN', () => {
      assert.ok(Number.isNaN(defaultParsers.get(Number)('blah')));
    });
  });

  describe('Array', () => {
    it('returns an empty array if the value is falsey', () => {
      var returnedValue = defaultParsers.get(Array)(undefined);

      assert.strictEqual(Array.isArray(returnedValue), true);
      assert.strictEqual(returnedValue.length, 0);
    });

    it('returns the passed value if it is already an array', () => {
      var passedValue = [1, 2, 3];
      var returnedValue = defaultParsers.get(Array)(passedValue);

      assert.strictEqual(returnedValue, passedValue);
    });

    it('returns the passed comma delimited string as an array', () => {
      var returnedValue = defaultParsers.get(Array)('foo,bar,baz');

      assert.strictEqual(Array.isArray(returnedValue), true);

      assert.strictEqual(returnedValue[0], 'foo');
      assert.strictEqual(returnedValue[1], 'bar');
      assert.strictEqual(returnedValue[2], 'baz');
    });

    it('casts a number to a string before returning it wrapped in an array', () => {
      var returnedValue = defaultParsers.get(Array)(123);

      assert.strictEqual(Array.isArray(returnedValue), true);
      assert.strictEqual(returnedValue.length, 1);
      assert.strictEqual(returnedValue[0], '123');
    });
  });
});
