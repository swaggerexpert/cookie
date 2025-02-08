import { Parser } from 'apg-lite';

import Grammar from '../../../grammar.js';
import { percentEncodeChar, isQuoted as isQuotedPredicate } from '../../../utils.js';
import cookieValueLenientEncoder from './cookie-value-lenient.js';

const parser = new Parser();
const grammar = new Grammar();

const cookieValueLenientPercentEncoder = (cookieValue) => {
  return cookieValueLenientEncoder(cookieValue, (value) => {
    const isQuoted = isQuotedPredicate(String(cookieValue));
    const startRule = isQuoted ? 'lenient-quoted-char' : 'lenient-cookie-octet';

    console.dir(isQuoted);

    let result = '';
    for (const char of value) {
      result += parser.parse(grammar, startRule, char).success ? char : percentEncodeChar(char);
    }

    return result;
  });
};

export default cookieValueLenientPercentEncoder;

console.dir(parser.parse(grammar, 'lenient-cookie-octet', '"'));
