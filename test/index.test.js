'use strict';

var assert = require('assert');
var sinon = require('sinon');
var SandboxedModule = require('sandboxed-module');

describe('konfiga', function() {
    var konfiga;
    var minimistStub;
    var processConfigStub;
    var fakeArgv;
    var fakeEnv;

    before(function() {
        minimistStub = sinon.stub();
        processConfigStub = sinon.stub();

        fakeArgv = ['a', 'command', '--an-arg', 'argValue'];
        fakeEnv = {'AN_ARG': 'argValue'};

        konfiga = SandboxedModule.require('../index', {
            requires: {
                minimist: minimistStub,
                './lib/processConfig': processConfigStub
            },
            globals: {
                process: {
                    argv: fakeArgv,
                    env: fakeEnv
                }
            }
        });
    });

    beforeEach(function() {
        minimistStub.returns('fakeMinimistOutput');
        processConfigStub.returns('fakeProcessedConfig');
    });

    afterEach(function() {
        minimistStub.reset();
        processConfigStub.reset();
    });

    it('is a function', function() {
        assert.strictEqual(typeof konfiga, 'function');
    });

    it('has an arity of 2', function() {
        assert.strictEqual(konfiga.length, 2);
    });

    it('returns a processed config object', function() {
        assert.strictEqual(konfiga('fakeSchema'), 'fakeProcessedConfig');
    });

    it('passes the first argument (schema) to processConfig', function() {
        konfiga('fakeSchema');

        assert.strictEqual(processConfigStub.args[0][0], 'fakeSchema');
    });

    it('passes the argv option to processConfig if present', function() {
        var customArgvObject = {some: 'rubbish'};

        konfiga('fakeSchema', {argv: customArgvObject});

        assert.strictEqual(processConfigStub.args[0][1], customArgvObject);
    });

    it('passes the env option to processConfig if present', function() {
        var customEnvObject = {some: 'rubbish'};

        konfiga('fakeSchema', {env: customEnvObject});

        assert.strictEqual(processConfigStub.args[0][2], customEnvObject);
    });

    describe('if no argv option is passed', function() {
        it('passes every arg after the second of process.argv to minimist', function() {
            konfiga('fakeSchema');

            assert.strictEqual(minimistStub.callCount, 1);
            assert.strictEqual(minimistStub.calledWith(['--an-arg', 'argValue']), true);
        });

        describe('the value returned by minimist', function() {
            it('is passed to processConfig', function() {
                konfiga('fakeSchema');

                assert.strictEqual(processConfigStub.args[0][1], 'fakeMinimistOutput');
            });
        });
    });

    describe('if no env option is passed', function() {
        it('passes proccess.env to processConfig', function() {
            konfiga('fakeSchema');

            assert.strictEqual(processConfigStub.args[0][2], fakeEnv);
        });
    });
});
