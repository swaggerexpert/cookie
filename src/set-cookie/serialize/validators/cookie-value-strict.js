import testCookieValue from '../../../cookie/test/cookie-value.js';

const cookieValueStrictValidator = (cookieValue) => {
  if (!testCookieValue(cookieValue)) {
    throw new TypeError(`Invalid cookie value: ${cookieValue}`);
  }
};

export default cookieValueStrictValidator;
