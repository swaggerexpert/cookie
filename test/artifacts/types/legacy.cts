// Type checks of code written against v2.0.2 typings (backward compatibility), CommonJS consumer.
import {
  parseCookie,
  serializeCookie,
  Grammar,
  CookiePair,
  ParseResult,
  ParseOptions,
  cookieValueLenientPercentEncoder,
  cookieNameLenientValidator,
  cookieValueLenientValidator,
  base64Encoder,
  identity,
  noop,
} from '@swaggerexpert/cookie';
const options: ParseOptions = { strict: false };
const parseResult: ParseResult = parseCookie('foo=bar', options);
const success: boolean = parseResult.result.success;
const parts: CookiePair[] = [];
const translated: CookiePair[] = parseResult.ast.translate(parts);
const xml: string = parseResult.ast.toXml();
const s1: string = serializeCookie(
  { foo: 'bar' },
  {
    encoders: { value: cookieValueLenientPercentEncoder },
    validators: { name: cookieNameLenientValidator, value: cookieValueLenientValidator },
  },
);
const s2: string = serializeCookie([['foo', 'bar']], {
  encoders: { name: identity, value: identity },
  validators: { name: noop, value: noop },
});
const b: string = base64Encoder('x');
const g: string = new Grammar().toString();
