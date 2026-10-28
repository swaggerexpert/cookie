import base64Decoder from './base64.node.js';
import { isQuoted as isQuotedPredicate, unquote, quote } from '../../../utils.js';

const cookieValueBase64Decoder = (cookieValue, decoder = base64Decoder) => {
  const value = String(cookieValue);

  // detect if the value is quoted
  const isQuoted = isQuotedPredicate(value);

  // remove quotes if present for processing
  const valueToDecode = isQuoted ? unquote(value) : value;

  // decode the value
  const result = decoder(valueToDecode);

  // return quoted if input was quoted, unquoted otherwise
  return isQuoted ? quote(result) : result;
};

export default cookieValueBase64Decoder;
