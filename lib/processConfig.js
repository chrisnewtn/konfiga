'use strict';

var castValue = require('./castValue');

module.exports = function processConfig(schema, argv, env, parsers) {
  var config = {};
  var argvNames = Object.getOwnPropertyNames(argv);
  var envNames = Object.getOwnPropertyNames(env);
  var missingRequiredProperties = [];

  Object.keys(schema).forEach(function processOption(optionName) {
    var optionProperties = schema[optionName];
    var type = optionProperties.type;
    var cmdArgName = optionProperties.cmdLineArgName;
    var envVarname = optionProperties.envVariableName;
    var hasArgvName = argvNames.indexOf(cmdArgName) !== -1;
    var hasEnvName = envNames.indexOf(envVarname) !== -1;
    var hasDefault = Object.hasOwnProperty.call(optionProperties, 'defaultValue');

    if (hasArgvName) {
      config[optionName] = castValue(argv[cmdArgName], type, parsers);
    } else if (hasEnvName) {
      config[optionName] = castValue(env[envVarname], type, parsers);
    } else if (optionProperties.required && !hasDefault) {
      missingRequiredProperties.push(optionName);
    } else {
      config[optionName] = castValue(optionProperties.defaultValue, type, parsers);
    }
  });

  if (missingRequiredProperties.length) {
    throw new Error('Missing required config for: ' + missingRequiredProperties.join(', '));
  }

  return Object.freeze(config);
};
