import { Parser, Stats } from 'apg-lite';

import Grammar from '../../grammar.js';
import ASTTranslator from '../../cookie/parse/translators/ASTTranslator.js';
import Trace from '../../cookie/parse/trace/Trace.js';
import CookieParseError from '../../errors/CookieParseError.js';

const grammar = new Grammar();

const parse = (
  setCookieString,
  {
    strict = true,
    decoders = {},
    translator = new ASTTranslator({ decoders }),
    stats = false,
    trace = false,
  } = {},
) => {
  if (typeof setCookieString !== 'string') {
    throw new TypeError('Set-Cookie string must be a string');
  }

  try {
    const parser = new Parser();
    const startRule = strict ? 'set-cookie-string' : 'lenient-set-cookie-string';

    if (translator) parser.ast = translator;
    if (stats) parser.stats = new Stats();
    if (trace) parser.trace = new Trace();

    const result = parser.parse(grammar, startRule, setCookieString);

    return {
      result,
      tree: result.success && translator ? parser.ast.getTree() : undefined,
      stats: parser.stats,
      trace: parser.trace,
    };
  } catch (error) {
    throw new CookieParseError('Unexpected error during Set-Cookie parsing', {
      cause: error,
      setCookieString,
    });
  }
};

export default parse;
