import { isQuoted as isQuotedPredicate, unquote, quote } from '../../../utils.js';

const cookieValuePercentDecoder = (cookieValue) => {
  const value = String(cookieValue);

  // detect if the value is quoted
  const isQuoted = isQuotedPredicate(value);

  // remove quotes if present for processing
  const valueToDecode = isQuoted ? unquote(value) : value;

  let result;
  try {
    result = decodeURIComponent(valueToDecode);
  } catch (error) {
    throw new TypeError(`Invalid percent-encoded cookie value: ${value}`, { cause: error });
  }

  // return quoted if input was quoted, unquoted otherwise
  return isQuoted ? quote(result) : result;
};

export default cookieValuePercentDecoder;
