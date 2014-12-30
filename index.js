'use strict';

var minimist = require('minimist');
var processConfig = require('./lib/processConfig');

module.exports = function konfiga(schema, options) {
    var opts = options || {};
    var argv = opts.argv || minimist(process.argv.slice(2));
    var env = opts.env || process.env;

    return processConfig(schema, argv, env);
};
