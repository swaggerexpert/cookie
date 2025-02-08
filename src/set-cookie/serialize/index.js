import cookieValueStrictBase64urlEncoder from './encoders/cookie-value-strict-base64url.js';
import cookieNameStrictValidator from './validators/cookie-name-strict.js';
import cookieValueStrictValidator from './validators/cookie-value-strict.js';
import { identity } from '../../utils.js';

const defaultOptions = {
  encoders: {
    name: identity,
    value: cookieValueStrictBase64urlEncoder,
  },
  validators: {
    name: cookieNameStrictValidator,
    value: cookieValueStrictValidator,
  },
};

const serialize = (name, value, options = {}) => {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    encoders: { ...defaultOptions.encoders, ...options.encoders },
    validators: { ...defaultOptions.validators, ...options.validators },
  };

  const encodedName = mergedOptions.encoders.name(name);
  const encodedValue = mergedOptions.encoders.value(value);

  mergedOptions.validators.name(encodedName);
  mergedOptions.validators.value(encodedValue);

  return `${encodedName}=${encodedValue}`;
};

export default serialize;
