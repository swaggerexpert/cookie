import { Parser, Stats } from 'apg-lite';

import Grammar from '../../grammar.js';
import ASTTranslator from './translators/ASTTranslator.js';
import ListTranslator from './translators/ListTranslator.js';
import Trace from './trace/Trace.js';
import CookieParseError from '../../errors/CookieParseError.js';

const grammar = new Grammar();

const parse = (
  cookieString,
  { strict = true, translator = new ASTTranslator(), stats = false, trace = false } = {},
) => {
  if (typeof cookieString !== 'string') {
    throw new TypeError('Cookie string must be a string');
  }

  try {
    const parser = new Parser();
    const startRule = strict ? 'cookie-string' : 'lenient-cookie-string';

    if (translator) parser.ast = translator;
    if (stats) parser.stats = new Stats();
    if (trace) parser.trace = new Trace();

    const result = parser.parse(grammar, startRule, cookieString);
    // avoid parsing twice when the deprecated `ast` can be served by the provided translator
    let ast = translator && translator.constructor === ListTranslator ? parser.ast : undefined;

    return {
      result,
      tree: result.success && translator ? parser.ast.getTree() : undefined,
      stats: parser.stats,
      trace: parser.trace,
      /**
       * @deprecated retained for backward compatibility, use `tree` instead
       */
      get ast() {
        if (ast === undefined) {
          const listParser = new Parser();
          listParser.ast = new ListTranslator();
          listParser.parse(grammar, startRule, cookieString);
          ast = listParser.ast;
        }
        return ast;
      },
      set ast(value) {
        ast = value;
      },
    };
  } catch (error) {
    throw new CookieParseError('Unexpected error during Cookie parsing', {
      cause: error,
      cookieString,
    });
  }
};

export default parse;
