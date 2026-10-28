import parse from '../parse/index.js';

/**
 * Test if a string is a valid Set-Cookie string.
 *
 * @param {string} setCookieString
 * @param {Object} [options={}] - An object.
 * @param {boolean} [options.strict=true] - A boolean indicating whether to use strict RFC 6265 set-cookie-string grammar or lenient one.
 * @returns {boolean}
 */
const testSetCookie = (setCookieString, { strict = true } = {}) => {
  try {
    return parse(setCookieString, { strict, translator: null }).result.success;
  } catch {
    return false;
  }
};

export default testSetCookie;
