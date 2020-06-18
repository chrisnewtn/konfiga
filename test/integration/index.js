'use strict';

const assert = require('assert');
const konfiga = require('../../');

describe('integration tests', () => {
  let opts;

  beforeEach(() => {
    opts = {env: {}, argv: []};
  });

  it('parses the default value of a required config option', () => {
    const config = konfiga({
      someValue: {
        defaultValue: 123,
        envVariableName: 'SOME_VALUE',
        required: true,
        type: Number
      }
    }, opts);

    assert.deepStrictEqual(config, {someValue: 123});
  });

  it('throws in the absence of a required config option', () => {
    const schema = {
      someValue: {
        envVariableName: 'SOME_VALUE',
        required: true,
        type: Number
      }
    };

    assert.throws(() => konfiga(schema, opts), /Missing required config for: someValue/);
  });

  it('parses required config present in the environment', () => {
    const config = konfiga({
      someValue: {
        defaultValue: 123,
        envVariableName: 'SOME_VALUE',
        required: true,
        type: Number
      }
    }, {
      env: {
        SOME_VALUE: '123'
      },
      argv: []
    });

    assert.deepStrictEqual(config, {someValue: 123});
  });
});
