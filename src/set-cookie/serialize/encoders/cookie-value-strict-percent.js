import { Parser } from 'apg-lite';

import Grammar from '../../../grammar.js';
import { percentEncodeChar } from '../../../utils.js';

const parser = new Parser();
const grammar = new Grammar();

const cookieValueStrictPercentEncoder = (cookieValue) => {
  const value = String(cookieValue);

  // detect if the value is quoted
  const isQuoted = value.length >= 2 && value.startsWith('"') && value.endsWith('"');

  // remove quotes if present for processing
  const valueToEncode = isQuoted ? value.slice(1, -1) : value;

  let result = '';
  for (const char of valueToEncode) {
    result += parser.parse(grammar, 'cookie-octet', char).success ? char : percentEncodeChar(char);
  }

  // return quoted if input was quoted, unquoted otherwise
  return isQuoted ? `"${result}"` : result;
};

export default cookieValueStrictPercentEncoder;
