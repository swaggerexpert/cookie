import testCookieValue from '../../../cookie/test/cookie-value.js';

const cookieValueLenientValidator = (cookieValue) => {
  if (!testCookieValue(cookieValue, { strict: false })) {
    throw new TypeError(`Invalid cookie value: ${cookieValue}`);
  }
};

export default cookieValueLenientValidator;
