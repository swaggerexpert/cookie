import { Parser } from 'apg-lite';

import Grammar from '../../grammar.js';

const parser = new Parser();
const grammar = new Grammar();

const testCookieValue = (cookieValue, { strict = true } = {}) => {
  try {
    const startRule = strict ? 'cookie-value' : 'lenient-cookie-value';

    return parser.parse(grammar, startRule, cookieValue).success;
  } catch {
    return false;
  }
};

export default testCookieValue;
