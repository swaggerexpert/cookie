import testCookieName from '../../../cookie/test/cookie-name.js';
import { percentEncodeChar } from '../../../utils.js';

const cookieNameStrictEncoder = (cookieName) => {
  const value = String(cookieName);

  let result = '';
  for (const char of value) {
    result += testCookieName(char) ? char : percentEncodeChar(char);
  }

  return result;
};

export default cookieNameStrictEncoder;
