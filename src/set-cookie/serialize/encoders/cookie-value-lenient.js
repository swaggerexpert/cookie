import testCookieValue from '../../../cookie/test/cookie-value.js';
import { isQuoted as isQuotedPredicate, unquote, quote } from '../../../utils.js';

const cookieValueLenientEncoder = (cookieValue, encoder) => {
  const value = String(cookieValue);

  // return early if the value is already valid
  if (testCookieValue(value, { strict: false })) return value;

  // detect if the value is quoted
  const isQuoted = isQuotedPredicate(value);

  // remove quotes if present for processing
  const valueToEncode = isQuoted ? unquote(value) : value;

  // encode the value
  const result = encoder(valueToEncode);

  // return quoted if input was quoted, unquoted otherwise
  return isQuoted ? quote(result) : result;
};

export default cookieValueLenientEncoder;
