import testCookieName from '../../../cookie/test/cookie-name.js';
import { percentEncodeChar } from '../../../utils.js';

const cookieNameStrictPercentEncoder = (cookieName) => {
  const value = String(cookieName);

  let result = '';
  for (const char of value) {
    result += testCookieName(char) ? char : percentEncodeChar(char);
  }

  return result;
};

export default cookieNameStrictPercentEncoder;
