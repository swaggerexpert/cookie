import testCookieName from '../../../cookie/test/cookie-name.js';

const cookieNameLenientValidator = (cookieName) => {
  if (!testCookieName(cookieName, { strict: false })) {
    throw new TypeError(`Invalid cookie name: ${cookieName}`);
  }
};

export default cookieNameLenientValidator;
