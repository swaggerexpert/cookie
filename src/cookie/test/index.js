import parse from '../parse/index.js';

/**
 * Test if a string is a valid cookie string.
 *
 * @param {string} cookieString
 * @param {Object} [options={}] - An object.
 * @param {boolean} [options.strict=true] - A boolean indicating whether to use strict RFC 6265 cookie-string grammar or lenient one.
 * @returns {boolean}
 */
const testCookie = (cookieString, { strict = true } = {}) => {
  try {
    return parse(cookieString, { strict, translator: null }).result.success;
  } catch {
    return false;
  }
};

export default testCookie;
