import testCookieValue from '../../../cookie/test/cookie-value.js';
import base64Encoder from './base64.node.js';
import { isQuoted as isQuotedPredicate, unquote, quote } from '../../../utils.js';

const cookieValueStrictBase64Encoder = (cookieValue) => {
  const value = String(cookieValue);

  // return early if the value is already valid
  if (testCookieValue(value)) return value;

  // detect if the value is quoted
  const isQuoted = isQuotedPredicate(value);

  // remove quotes if present for processing
  const valueToEncode = isQuoted ? unquote(value) : value;

  // base64 encode the value
  const base64EncodedValue = base64Encoder(valueToEncode);

  // return quoted if input was quoted, unquoted otherwise
  return isQuoted ? quote(base64EncodedValue) : base64EncodedValue;
};

export default cookieValueStrictBase64Encoder;
