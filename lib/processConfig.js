'use strict';

var castValue = require('./castValue');

module.exports = function processConfig(schema, argv, env) {
    var config = {};

    Object.keys(schema).forEach(function processOption(optionName) {
        var optionProperties = schema[optionName];
        var type = optionProperties.type;
        var value = argv[optionProperties.cmdLineArgName] ||
            env[optionProperties.envVariableName] ||
            optionProperties.defaultValue;

        config[optionName] = castValue(value, type);
    });

    return Object.freeze(config);
};
