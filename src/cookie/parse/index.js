import { Ast as AST, Parser } from 'apg-lite';

import Grammar from '../../grammar.js';
import cookieStringCallback from './callbacks/cookie-string.js';
import cookiePairCallback from './callbacks/cookie-pair.js';
import cookieNameCallback from './callbacks/cookie-name.js';
import cookieValueCallback from './callbacks/cookie-value.js';

const grammar = new Grammar();

const parse = (cookieString) => {
  const parser = new Parser();

  parser.ast = new AST();
  parser.ast.callbacks['cookie-string'] = cookieStringCallback;
  parser.ast.callbacks['cookie-pair'] = cookiePairCallback;
  parser.ast.callbacks['cookie-name'] = cookieNameCallback;
  parser.ast.callbacks['cookie-value'] = cookieValueCallback;

  const result = parser.parse(grammar, 'cookie-string', cookieString);

  return { result, ast: parser.ast };
};

export default parse;
