'use strict';

module.exports = function castValue(value, type, parsers) {
  const parser = type ? parsers.get(type) : parsers.get('default');

  if (!parser) {
    throw new Error('Unsupported config value type: ' + type.name);
  }

  return parser(value);
};
