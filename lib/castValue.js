'use strict';

module.exports = function castValue(value, type, parsers, optionName, source) {
  var parser = type ? parsers.get(type) : parsers.get('default');

  if (!parser) {
    throw new Error('Unsupported config value type: ' + type.name);
  }

  try {
    return parser(value);
  } catch (err) {
    throw new Error(
      'Unable to parse ' +
      value +
      ' using ' +
      parser.name +
      ' for option ' +
      optionName +
      ' from the ' +
      source
    );
  }
};
