'use strict';

var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('konfiga', () => {
  var konfiga;
  var minimistStub;
  var processConfigStub;
  var fakeArgv;
  var fakeEnv;

  before(() => {
    minimistStub = sinon.stub();
    processConfigStub = sinon.stub();

    fakeArgv = ['a', 'command', '--an-arg', 'argValue'];
    fakeEnv = {'AN_ARG': 'argValue'};

    konfiga = SandboxedModule.require('../index', {
      requires: {
        minimist: minimistStub,
        './lib/processConfig': processConfigStub,
        './lib/defaultParsers': new Map([['some', 'parsers']])
      },
      globals: {
        process: {
          argv: fakeArgv,
          env: fakeEnv
        }
      }
    });
  });

  beforeEach(() => {
    minimistStub.returns('fakeMinimistOutput');
    processConfigStub.returns('fakeProcessedConfig');
  });

  afterEach(() => {
    minimistStub.reset();
    processConfigStub.reset();
  });

  it('is a function', () => {
    assert.strictEqual(typeof konfiga, 'function');
  });

  it('has an arity of 2', () => {
    assert.strictEqual(konfiga.length, 2);
  });

  it('returns a processed config object', () => {
    assert.strictEqual(konfiga('fakeSchema'), 'fakeProcessedConfig');
  });

  it('passes the first argument (schema) to processConfig', () => {
    konfiga('fakeSchema');

    assert.strictEqual(processConfigStub.args[0][0], 'fakeSchema');
  });

  it('passes the argv option to processConfig if present', () => {
    var customArgvObject = {some: 'rubbish'};

    konfiga('fakeSchema', {argv: customArgvObject});

    assert.strictEqual(processConfigStub.args[0][1], customArgvObject);
  });

  it('passes the env option to processConfig if present', () => {
    var customEnvObject = {some: 'rubbish'};

    konfiga('fakeSchema', {env: customEnvObject});

    assert.strictEqual(processConfigStub.args[0][2], customEnvObject);
  });

  it('passes the parsers option merged with default parsers to processConfig if present', () => {
    konfiga('fakeSchema', {parsers: [{type: 'more', parser: 'custom-parsers'}]});

    assert.equal(processConfigStub.args[0][3].size, 2);
    assert.equal(processConfigStub.args[0][3].get('some'), 'parsers');
    assert.equal(processConfigStub.args[0][3].get('more'), 'custom-parsers');
  });

  describe('if no argv option is passed', () => {
    it('passes every arg after the second of process.argv to minimist', () => {
      konfiga('fakeSchema');

      assert.strictEqual(minimistStub.callCount, 1);
      assert.strictEqual(minimistStub.calledWith(['--an-arg', 'argValue']), true);
    });

    describe('the value returned by minimist', () => {
      it('is passed to processConfig', () => {
        konfiga('fakeSchema');

        assert.strictEqual(processConfigStub.args[0][1], 'fakeMinimistOutput');
      });
    });
  });

  describe('if no env option is passed', () => {
    it('passes proccess.env to processConfig', () => {
      konfiga('fakeSchema');

      assert.strictEqual(processConfigStub.args[0][2], fakeEnv);
    });
  });

  describe('if no parsers option is passed', () => {
    it('passes default parsers into the processConfig', () => {
      konfiga('fakeSchema');

      assert.equal(processConfigStub.args[0][3].size, 1);
      assert.equal(processConfigStub.args[0][3].get('some'), 'parsers');
    });
  });
});
