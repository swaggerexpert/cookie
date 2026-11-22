import { Parser, Stats, identifiers } from 'apg-lite';

import Grammar from '../../grammar.js';
import ASTTranslator from './translators/ASTTranslator.js';
import ListTranslator from './translators/ListTranslator.js';
import Trace from './trace/Trace.js';
import CookieParseError from '../../errors/CookieParseError.js';

const grammar = new Grammar();

const selectStartRule = (strict, recover) => {
  if (recover) return strict ? 'recovering-cookie-string' : 'recovering-lenient-cookie-string';
  return strict ? 'cookie-string' : 'lenient-cookie-string';
};

/**
 * apg-lite works with code points. Converts increasing code point offsets to UTF-16 code unit offsets,
 * so that `cookieString.slice(offset, offset + length)` returns the segment.
 */
const codeUnitCounter = () => {
  let point = 0;
  let unit = 0;
  return (chars, target) => {
    for (; point < target; point += 1) unit += chars[point] > 0xffff ? 2 : 1;
    return unit;
  };
};

// trailing OWS; a loop instead of a regular expression, which backtracks quadratically
const trimEnd = (text, end) => {
  while (end > 0 && ' \t\r\n'.includes(text[end - 1])) end -= 1;
  return end;
};

const skippedSegment = (cookieString, offset, end) => {
  const text = cookieString.slice(offset, end);
  const segment = { offset, length: text.length };
  const separatorIndex = text.indexOf('=');

  if (separatorIndex !== -1) segment.name = text.slice(0, trimEnd(text, separatorIndex));
  return segment;
};

/**
 * Collects segments skipped by the recovering grammar.
 * The skipped segment is never backtracked once matched, see recovering-cookie-segment rule.
 */
const skippedCollector = (cookieString, skipped) => {
  const toUnit = codeUnitCounter();

  return (sysData, chars, phraseIndex) => {
    if (sysData.state !== identifiers.MATCH) return;

    const offset = toUnit(chars, phraseIndex);
    const end = toUnit(chars, phraseIndex + sysData.phraseLength);
    skipped.push(skippedSegment(cookieString, offset, end));
  };
};

/**
 * Merges cookie pairs that failed to decode (CST nodes, in order of appearance) into skipped segments.
 */
const mergeUndecodable = (cookieString, skipped, nodes) => {
  if (nodes.length === 0) return skipped;

  const chars = [...cookieString].map((char) => char.codePointAt(0));
  const toUnit = codeUnitCounter();
  // lenient pairs with empty values end with the OWS following "="
  const undecodable = nodes.map(({ start, length }) => {
    const offset = toUnit(chars, start);
    const end = toUnit(chars, start + length);
    return skippedSegment(
      cookieString,
      offset,
      offset + trimEnd(cookieString.slice(offset, end), end - offset),
    );
  });

  return [...skipped, ...undecodable].sort((a, b) => a.offset - b.offset);
};

const parse = (
  cookieString,
  {
    strict = true,
    recover = false,
    decoders = {},
    translator = new ASTTranslator({ decoders }),
    stats = false,
    trace = false,
  } = {},
) => {
  if (typeof cookieString !== 'string') {
    throw new TypeError('Cookie string must be a string');
  }

  try {
    const parser = new Parser();
    const startRule = selectStartRule(strict, recover);
    const skipped = recover ? [] : undefined;

    if (translator) parser.ast = translator;
    if (stats) parser.stats = new Stats();
    if (trace) parser.trace = new Trace();
    if (recover)
      parser.callbacks['recovering-cookie-skipped'] = skippedCollector(cookieString, skipped);

    const result = parser.parse(grammar, startRule, cookieString);
    // avoid parsing twice when the deprecated `ast` can be served by the provided translator
    let ast = translator && translator.constructor === ListTranslator ? parser.ast : undefined;
    // in recovering mode, cookie pairs that fail to decode are skipped instead of failing the parse
    const undecodable = [];
    const treeOptions = recover ? { onDecodeError: (node) => undecodable.push(node) } : undefined;
    const tree = result.success && translator ? parser.ast.getTree(treeOptions) : undefined;

    return {
      result,
      tree,
      stats: parser.stats,
      trace: parser.trace,
      ...(recover && { skipped: mergeUndecodable(cookieString, skipped, undecodable) }),
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
