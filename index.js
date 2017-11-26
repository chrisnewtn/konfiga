'use strict';

var minimist = require('minimist');
var processConfig = require('./lib/processConfig');
var defaultParsers = require('./lib/defaultParsers');

module.exports = function konfiga(schema, options) {
  var opts = options || {};
  var argv = opts.argv || minimist(process.argv.slice(2));
  var env = opts.env || process.env;
  var parsers = new Map(defaultParsers);

  (opts.parsers || []).forEach(function(parserSpec) {
    parsers.set(parserSpec.type, parserSpec.parser);
  });

  return processConfig(schema, argv, env, parsers);
};
