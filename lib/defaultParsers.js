'use strict';

const URL = require('url').URL;
const defaultParsers = new Map();

defaultParsers.set('default', function parseDefault(value) {
  return value.toString();
});

defaultParsers.set(String, function parseString(value) {
  return value.toString();
});

defaultParsers.set(Boolean, function parseBoolean(value) {
  return value === 'true' || value === true;
});

defaultParsers.set(Number, function parseNumber(value) {
  return Number(value);
});

defaultParsers.set(Array, function parseArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value.toString().split(',');
});

if (URL) {
  defaultParsers.set(URL, function parseURL(value) {
    if (value instanceof URL) {
      return value;
    }
    return new URL(value);
  });
}

module.exports = defaultParsers;

