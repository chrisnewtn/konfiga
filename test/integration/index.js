'use strict';

const URL = require('url').URL;
const assert = require('assert');
const konfiga = require('../../');

function CryBaby(value) {
  throw new Error('whaaaaaa don\'t like ' + value + '!');
}

describe('integration tests', () => {
  let opts;
  let parsers;

  beforeEach(() => {
    opts = {env: {}, argv: []};
    parsers = [{type: CryBaby, parser: value => new CryBaby(value)}]
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

  it('does not throw when parsing fails so long as the parser does not throw either', () => {
    const schema = {
      someOption: {
        envVariableName: 'SOME_OPTION',
        type: Number
      }
    };

    opts = {env: {SOME_OPTION: 'test'}, argv: {}};

    assert(Number.isNaN(konfiga(schema, opts).someOption),
      'Expeceted someOption to be NaN');
  });

  it('throws when unable to parse a value from the command line', () => {
    const schema = {
      someOption: {
        cmdLineArgName: 'some-option',
        required: true,
        type: CryBaby
      }
    };

    opts = {env: {}, argv: {'some-option': 'test'}, parsers};

    assert.throws(() => konfiga(schema, opts),
      /Error: whaaaaaa don't like test/);
  });

  it('throws when unable to parse a value from the environment', () => {
    const schema = {
      someOption: {
        envVariableName: 'SOME_OPTION',
        required: true,
        type: CryBaby
      }
    };

    opts = {env: {SOME_OPTION: 'blah'}, argv: {}, parsers};

    assert.throws(() => konfiga(schema, opts),
      /Error: whaaaaaa don't like blah/);
  });

  it('throws when unable to parse a value from the default', () => {
    const schema = {
      someOption: {
        defaultValue: undefined,
        envVariableName: 'SOME_OPTION',
        type: String
      }
    };

    opts = {env: {}, argv: {}};

    assert.throws(() => konfiga(schema, opts),
      /TypeError: Cannot read property 'toString' of undefined/);
  });

  if (URL) {
    it('supports URL as a default type if running Node v6+', () => {
      const config = konfiga({
        someValue: {
          envVariableName: 'SOME_VALUE',
          required: true,
          type: URL
        }
      }, {
        env: {
          SOME_VALUE: 'http://www.example.com/'
        }
      });

      assert.deepStrictEqual(config, {someValue: new URL('http://www.example.com/')});
    });
  }

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
