'use strict';

module.exports = function castValue(value, type) {
    if (!type || type === String) {
        return value.toString();
    }

    if (type === Boolean) {
        return value === 'true' || value === true;
    }

    if (type === Number) {
        return Number(value);
    }

    if (type === Array) {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        return value.toString().split(',');
    }

    throw new Error('Unsupported config value type: ' + type.name);
};
