'use strict';

var assert = require('assert');
var sinon = require('sinon');
var castValue = require('../../lib/castValue');

describe('castValue', function() {
    it('is a function', function() {
        assert.strictEqual(typeof castValue, 'function');
    });

    it('has an arity of 2', function() {
        assert.strictEqual(castValue.length, 2);
    });

    it('throws if the type passed is not supported', function() {
        function UnsupportedType() {}

        function test() {
            castValue(null, UnsupportedType);
        }

        assert.throws(test, 'Unsupported config value type: UnsupportedType');
    });

    describe('when passed a value with no type', function() {
        var value;

        beforeEach(function() {
            value = {toString: sinon.stub().returns('gunk')};
        });

        it('calls the value\'s toString method', function() {
            castValue(value);

            assert.strictEqual(value.toString.callCount, 1);
        });

        it('returns the result of the value\'s toString method', function() {
            assert.strictEqual(castValue(value), 'gunk');
        });
    });

    describe('when passed a value with a type of String', function() {
        var value;

        beforeEach(function() {
            value = {toString: sinon.stub().returns('gunk')};
        });

        it('calls the value\'s toString method', function() {
            castValue(value, String);

            assert.strictEqual(value.toString.callCount, 1);
        });

        it('returns the result of the value\'s toString method', function() {
            assert.strictEqual(castValue(value, String), 'gunk');
        });
    });

    describe('when passed a value with and a type of Boolean', function() {
        it('returns true if the value is "true"', function() {
            assert.strictEqual(castValue('true', Boolean), true);
        });

        it('returns true if the value is true', function() {
            assert.strictEqual(castValue(true, Boolean), true);
        });

        it('returns false if the value is falsey', function() {
            assert.strictEqual(castValue(undefined, Boolean), false);
        });
    });

    describe('when passed a value with and a type of Number', function() {
        var numberStub;

        before(function(){
            numberStub = sinon.stub(global, 'Number').returns('numberGunk');
        });

        after(function(){
            numberStub.restore();
        });

        it('passes the value to Number', function() {
            castValue('42', Number);

            assert.strictEqual(numberStub.calledWith('42'), true);

            assert.strictEqual(numberStub.callCount, 1);
        });

        it('returns the result from Number', function() {
            assert.strictEqual(castValue('42', Number), 'numberGunk');
        });
    });

    describe('when passed a value with and a type of Array', function() {
        it('returns an empty array if the value is falsey', function() {
            var returnedValue = castValue(undefined, Array);

            assert.strictEqual(Array.isArray(returnedValue), true);

            assert.strictEqual(returnedValue.length, 0);
        });

        it('returns the passed value if it is already an array', function() {
            var passedValue = [1, 2, 3];
            var returnedValue = castValue(passedValue, Array);

            assert.strictEqual(returnedValue, passedValue);
        });

        it('returns the passed comma delimited string as an array', function() {
            var returnedValue = castValue('foo,bar,baz', Array);

            assert.strictEqual(Array.isArray(returnedValue), true);

            assert.strictEqual(returnedValue[0], 'foo');
            assert.strictEqual(returnedValue[1], 'bar');
            assert.strictEqual(returnedValue[2], 'baz');
        });

        it('casts a number to a string before returning it wrapped in an array', function() {
            var returnedValue = castValue(123, Array);

            assert.strictEqual(Array.isArray(returnedValue), true);
            assert.strictEqual(returnedValue.length, 1);
            assert.strictEqual(returnedValue.args[0], '123');
        });
    });
});
