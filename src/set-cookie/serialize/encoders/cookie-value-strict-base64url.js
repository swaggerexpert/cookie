import testCookieValue from '../../../cookie/test/cookie-value.js';
import base64urlEncoder from './base64url.node.js';

const cookieValueStrictBase64urlEncoder = (cookieValue) => {
  const value = String(cookieValue);
  return testCookieValue(value) ? value : base64urlEncoder(value);
};

export default cookieValueStrictBase64urlEncoder;
