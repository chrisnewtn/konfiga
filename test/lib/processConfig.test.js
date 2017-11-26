'use strict';

var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('processConfig', function() {
  var exampleSchema;
  var processConfig;
  var castValueStub;

  before(function() {
    castValueStub = sinon.stub();

    processConfig = SandboxedModule.require('../../lib/processConfig', {
      requires: {
        './castValue': castValueStub
      }
    });

    exampleSchema = {
      testOption: {
        defaultValue: 'defaultValue',
        envVariableName: 'TEST_OPTION',
        cmdLineArgName: 'test-option',
        type: String
      },
      anotherTestOption: {
        defaultValue: 42,
        envVariableName: 'ANOTHER_TEST_OPTION',
        cmdLineArgName: 'another-test-option',
        type: Number
      }
    };
  });

  afterEach(function() {
    castValueStub.reset();
  });

  it('is a function', function() {
    assert.strictEqual(typeof processConfig, 'function');
  });

  it('has an arity of 4', function() {
    assert.strictEqual(processConfig.length, 4);
  });

  it('returns a frozen object', function() {
    var returnedObject = processConfig(exampleSchema, {}, {}, 'the-parsers');

    assert.strictEqual(Object.isFrozen(returnedObject), true);
  });

  describe('required options', function() {
    var exampleSchema;
    var argv;
    var env;

    before(function() {
      exampleSchema = {
        testOption: {
          required: true,
          envVariableName: 'TEST_OPTION',
          cmdLineArgName: 'test-option',
          type: String
        },
        anotherTestOption: {
          required: true,
          envVariableName: 'ANOTHER_TEST_OPTION',
          cmdLineArgName: 'another-test-option',
          type: Number
        }
      };

      argv = {
        'test-option': 'blah'
      };

      env = {
        'TEST_OPTION': 'meh',
        'ANOTHER_TEST_OPTION': '1234'
      };

      castValueStub.withArgs('blah', String).returns('fakeCastCliString');
      castValueStub.withArgs('1234', Number).returns('fakeCastEnvNumber');
    });

    it('throws when required options are missing', function() {
      assert.throws(
        function() {
          processConfig(exampleSchema, {}, {}, 'the-parsers');
        },
        Error,
        'Missing required config for: testOption, anotherTestOption'
      );
    });

    it('does not throw when no required options are missing', function() {
      assert.doesNotThrow(function() {
        processConfig(exampleSchema, argv, env, 'the-parsers');
      });
    });

    it('gives precedence to CLI arguments', function() {
      processConfig(exampleSchema, argv, env, 'the-parsers');

      assert(castValueStub.calledWith('blah', String, 'the-parsers'));
      assert(castValueStub.calledWith('1234', Number, 'the-parsers'));
    });

    it('puts parsed required args on the returned object', function() {
      var config = processConfig(exampleSchema, argv, env, 'the-parsers');

      assert.deepEqual(config, {
        testOption: 'fakeCastCliString',
        anotherTestOption: 'fakeCastEnvNumber'
      });
    });
  });

  describe('each option of the schema passed', function() {
    var argv;

    beforeEach(function(){
      argv = {
        'test-option': 'testCliValue',
        'another-test-option': '52'
      };

      castValueStub.withArgs('testCliValue', String).returns('fakeCastCliString');
      castValueStub.withArgs('52', Number).returns('fakeCastCliNumber');
    });

    it('is present on the returned object', function() {
      var returnedObject = processConfig(exampleSchema, {}, {}, 'the-parsers');

      assert(returnedObject.hasOwnProperty('testOption'));
      assert(returnedObject.hasOwnProperty('anotherTestOption'));
    });

    describe('each command line value', function(){
      var returnedObject;

      beforeEach(function(){
        returnedObject = processConfig(exampleSchema, argv, {}, 'the-parsers');
      });

      it('is cast to the type specified in the schema', function() {
        assert.strictEqual(castValueStub.callCount, 2);

        assert(castValueStub.calledWith('testCliValue', String, 'the-parsers'));
        assert(castValueStub.calledWith('52', Number, 'the-parsers'));
      });

      it('has its cast value set on the return object', function() {
        assert.strictEqual(returnedObject.testOption, 'fakeCastCliString');
        assert.strictEqual(returnedObject.anotherTestOption, 'fakeCastCliNumber');
      });
    });

    describe('each environment variable value', function(){
      var returnedObject;
      var env;

      beforeEach(function(){
        env = {
          'TEST_OPTION': 'testEnvValue',
          'ANOTHER_TEST_OPTION': '48'
        };

        castValueStub.withArgs('testEnvValue', String).returns('fakeCastEnvString');
        castValueStub.withArgs('48', Number).returns('fakeCastEnvNumber');
      });

      describe('if no equivilant command line value is found', function() {
        beforeEach(function() {
          returnedObject = processConfig(exampleSchema, {}, env, 'the-parsers');
        });

        it('is cast to the type specified in the schema', function() {
          assert.strictEqual(castValueStub.callCount, 2);

          assert(castValueStub.calledWith('testEnvValue', String, 'the-parsers'));
          assert(castValueStub.calledWith('48', Number, 'the-parsers'));
        });

        it('has its cast value set on the return object', function() {
          assert.strictEqual(returnedObject.testOption, 'fakeCastEnvString');
          assert.strictEqual(returnedObject.anotherTestOption, 'fakeCastEnvNumber');
        });
      });

      describe('if command line values are found also', function() {
        beforeEach(function() {
          returnedObject = processConfig(exampleSchema, argv, env, 'the-parsers');
        });

        it('casts and appends the command line values instead', function() {
          assert.strictEqual(castValueStub.callCount, 2);

          assert(castValueStub.calledWith('testCliValue', String, 'the-parsers'));
          assert(castValueStub.calledWith('52', Number, 'the-parsers'));

          assert.strictEqual(returnedObject.testOption, 'fakeCastCliString');
          assert.strictEqual(returnedObject.anotherTestOption, 'fakeCastCliNumber');
        });
      });
    });

    describe('if no command line or environment values are found', function() {
      var returnedObject;

      beforeEach(function() {
        castValueStub.withArgs('defaultValue', String).returns('fakeCastDefaultString');
        castValueStub.withArgs(42, Number).returns('fakeCastDefaultNumber');

        returnedObject = processConfig(exampleSchema, {}, {}, 'the-parsers');
      });

      it('casts each default value onto the return object', function() {
        assert.strictEqual(castValueStub.callCount, 2);

        assert(castValueStub.calledWith('defaultValue', String, 'the-parsers'));
        assert(castValueStub.calledWith(42, Number, 'the-parsers'));

        assert.strictEqual(returnedObject.testOption, 'fakeCastDefaultString');
        assert.strictEqual(returnedObject.anotherTestOption, 'fakeCastDefaultNumber');
      });
    });
  });
});
