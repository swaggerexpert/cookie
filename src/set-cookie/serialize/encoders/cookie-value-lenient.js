import { Parser } from 'apg-lite';

import Grammar from '../../../grammar.js';
import { percentEncodeChar } from '../../../utils.js';

const parser = new Parser();
const grammar = new Grammar();

const cookieValueLenientEncoder = (cookieValue) => {
  const value = String(cookieValue);

  // detect if the value is quoted
  const isQuoted = value.length >= 2 && value.startsWith('"') && value.endsWith('"');

  // remove quotes if present for processing
  const valueToEncode = isQuoted ? value.slice(1, -1) : value;

  const startRule = isQuoted ? 'lenient-quoted-char' : 'lenient-cookie-octet';

  let result = '';
  for (const char of valueToEncode) {
    result += parser.parse(grammar, startRule, char).success ? char : percentEncodeChar(char);
  }

  return isQuoted ? `"${result}"` : result;
};

export default cookieValueLenientEncoder;
