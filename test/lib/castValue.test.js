'use strict';

var assert = require('assert');
var sinon = require('sinon');
var castValue = require('../../lib/castValue');

describe('castValue', () => {
  var parsers;

  beforeEach(() => {
    parsers = new Map([
      ['test-type', sinon.stub().returns('returned-by-parser-two')],
      ['default', sinon.stub().returns('returned-by-default-parser')]
    ]);
  });

  it('is a function', () => {
    assert.strictEqual(typeof castValue, 'function');
  });

  it('has an arity of 3', () => {
    assert.strictEqual(castValue.length, 3);
  });

  it('throws if the type passed is not supported', () => {
    function UnsupportedType() {}

    function test() {
      castValue(null, UnsupportedType, parsers);
    }

    assert.throws(test, 'Unsupported config value type: UnsupportedType');
  });

  describe('when passed a value with no type', () => {
    var value;
    var parsed;

    beforeEach(() => {
      value = {toString: sinon.stub().returns('gunk')};
      parsed = castValue(value, undefined, parsers);
    });

    it('calls the default parser with the value', () => {
      assert.deepStrictEqual(parsers.get('default').args, [[value]]);
    });

    it('returns the result of default parser', () => {
      assert.strictEqual(parsed, 'returned-by-default-parser');
    });
  });

  describe('when passed a valid type', () => {
    var parsed;

    beforeEach(() => {
      parsed = castValue('blah', 'test-type', parsers);
    });

    it('calls the appropriate parser with the given value', () => {
      assert.ok(parsers.get('test-type').callCount, 1);
    });

    it('returns the retured value of the parser', () => {
      assert.equal(parsed, 'returned-by-parser-two');
    });
  });
});
