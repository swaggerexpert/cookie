import { Parser } from 'apg-lite';

import Grammar from '../../../grammar.js';
import {
  percentEncodeChar,
  isQuoted as isQuotedPredicate,
  unquote,
  quote,
} from '../../../utils.js';

const parser = new Parser();
const grammar = new Grammar();

const cookieValueStrictPercentEncoder = (cookieValue) => {
  const value = String(cookieValue);

  // detect if the value is quoted
  const isQuoted = isQuotedPredicate(value);

  // remove quotes if present for processing
  const valueToEncode = isQuoted ? unquote(value) : value;

  let result = '';
  for (const char of valueToEncode) {
    result += parser.parse(grammar, 'cookie-octet', char).success ? char : percentEncodeChar(char);
  }

  // return quoted if input was quoted, unquoted otherwise
  return isQuoted ? quote(result) : result;
};

export default cookieValueStrictPercentEncoder;
