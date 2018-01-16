'use strict';

const URL = require('url').URL;
const assert = require('assert');
const defaultParsers = require('../../lib/defaultParsers');

describe('defaultParsers', function() {
  describe('default', function() {
    it('calls toString on the given value, and returns the result', function() {
      var value = {
        toString: function() {
          return 'to-string-result';
        }
      }

      assert.equal(defaultParsers.get('default')(value), 'to-string-result');
    });
  });

  describe('String', function() {
    it('calls toString on the given value, and returns the result', function() {
      var value = {
        toString: function() {
          return 'to-string-result';
        }
      }

      assert.equal(defaultParsers.get('default')(value), 'to-string-result');
    });
  });

  describe('Boolean', function() {
    it('returns true if the value is "true"', function() {
      assert.strictEqual(defaultParsers.get(Boolean)('true'), true);
    });

    it('returns true if the value is true', function() {
      assert.strictEqual(defaultParsers.get(Boolean)(true), true);
    });

    it('returns false if the value is falsey', function() {
      assert.strictEqual(defaultParsers.get(Boolean)(undefined), false);
    });
  });

  describe('Number', function() {
    it('returns a number', function() {
      assert.strictEqual(defaultParsers.get(Number)(12.34), 12.34);
    });

    it('destringifies an integer', function() {
      assert.strictEqual(defaultParsers.get(Number)('12'), 12);
    });

    it('destringifies a decimal', function() {
      assert.strictEqual(defaultParsers.get(Number)('12.34'), 12.34);
    });

    it('destringifies other things to NaN', function() {
      assert.ok(Number.isNaN(defaultParsers.get(Number)('blah')));
    });
  });

  describe('Array', function() {
    it('returns an empty array if the value is falsey', function() {
      var returnedValue = defaultParsers.get(Array)(undefined);

      assert.strictEqual(Array.isArray(returnedValue), true);
      assert.strictEqual(returnedValue.length, 0);
    });

    it('returns the passed value if it is already an array', function() {
      var passedValue = [1, 2, 3];
      var returnedValue = defaultParsers.get(Array)(passedValue);

      assert.strictEqual(returnedValue, passedValue);
    });

    it('returns the passed comma delimited string as an array', function() {
      var returnedValue = defaultParsers.get(Array)('foo,bar,baz');

      assert.strictEqual(Array.isArray(returnedValue), true);

      assert.strictEqual(returnedValue[0], 'foo');
      assert.strictEqual(returnedValue[1], 'bar');
      assert.strictEqual(returnedValue[2], 'baz');
    });

    it('casts a number to a string before returning it wrapped in an array', function() {
      var returnedValue = defaultParsers.get(Array)(123);

      assert.strictEqual(Array.isArray(returnedValue), true);
      assert.strictEqual(returnedValue.length, 1);
      assert.strictEqual(returnedValue[0], '123');
    });
  });

  if (URL) {
    describe('when using a version of Node that supports the WHATWG URL api', function() {
      it('has URL as a default parser', () => {
        assert(defaultParsers.has(URL));
      });

      it('throws if the value passed is not a valid URL', () => {
        assert.throws(() => defaultParsers.get(URL)('blah'), TypeError)
      });

      it('returns a URL object derived from the passed value', () => {
        const url = defaultParsers.get(URL)('http://example.com/ ');

        assert.equal(url instanceof URL, true, 'Expected the returned value to be a URL');
        assert.equal(url.href, 'http://example.com/');
      });

      it('acts as a passthrough if the value passed is already a URL', () => {
        const url = new URL('http://example.com/ ');
        const parsedUrl = defaultParsers.get(URL)(url);

        assert.deepEqual(url, parsedUrl);
      });
    });
  } else {
    describe('when using a version of Node that does not support the WHATWG URL api', function() {
      it('does not have URL as a default parser', () => {
        assert(!defaultParsers.has(URL));
      });
    });
  }
});
