'use strict';

const minimist = require('minimist');
const processConfig = require('./lib/processConfig');
const defaultParsers = require('./lib/defaultParsers');

module.exports = function konfiga(schema, options) {
  const opts = options || {};
  const argv = opts.argv || minimist(process.argv.slice(2));
  const env = opts.env || process.env;
  const parsers = new Map(defaultParsers);

  (opts.parsers || []).forEach(({type, parser}) => parsers.set(type, parser));

  return processConfig(schema, argv, env, parsers);
};
