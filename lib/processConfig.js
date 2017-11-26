'use strict';

const castValue = require('./castValue');

module.exports = function processConfig(schema, argv, env, parsers) {
  const config = {};
  const argvNames = Object.getOwnPropertyNames(argv);
  const envNames = Object.getOwnPropertyNames(env);
  const missingRequiredProperties = [];

  Object.keys(schema).forEach(function processOption(optionName) {
    const optionProperties = schema[optionName];
    const type = optionProperties.type;
    const cmdArgName = optionProperties.cmdLineArgName;
    const envVarname = optionProperties.envVariableName;
    const hasArgvName = argvNames.indexOf(cmdArgName) !== -1;
    const hasEnvName = envNames.indexOf(envVarname) !== -1;
    const hasDefault = Object.hasOwnProperty.call(optionProperties, 'defaultValue');

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
