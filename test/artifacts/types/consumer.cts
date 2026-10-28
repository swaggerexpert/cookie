// Type checks of the published typings from a CommonJS consumer.
import {
  parseCookie,
  testCookie,
  testCookieName,
  testCookieValue,
  serializeCookie,
  serializeSetCookie,
  type SetCookieString,
  Grammar,
  CSTTranslator,
  ListTranslator,
  CookieParseError,
  cookieValueStrictBase64Encoder,
  cookieValueRotatingDecoder,
  createCookieValueRotatingDecoder,
  cookieValueBase64urlDecoder,
  ASTTranslator,
  type ASTNode,
  type CSTNode,
  type ListTree,
  type CookiePair,
} from '@swaggerexpert/cookie';

const ast: ASTNode | undefined = parseCookie('foo=bar').tree;
const cst: CSTNode | undefined = parseCookie('foo=bar', { translator: new CSTTranslator() }).tree;
const list: ListTree | undefined = parseCookie('foo=bar', {
  translator: new ListTranslator(),
}).tree;
const lenient: boolean = parseCookie('foo = bar', { strict: false }).result.success;

// deprecated ast retained for backward compatibility
const parts: CookiePair[] = [];
const translated: CookiePair[] = parseCookie('foo=bar').ast.translate(parts);
const xml: string = parseCookie('foo=bar').ast.toXml();

const valid: boolean = testCookie('foo=bar', { strict: false });
const validName: boolean = testCookieName('session_id', { strict: false });
const validValue: boolean = testCookieValue('"bar"', { quoted: null });
const setCookie: SetCookieString = serializeSetCookie('foo', 'bar');
const serialized: string = serializeCookie(
  { foo: 'bar' },
  { encoders: { value: cookieValueStrictBase64Encoder } },
);
const grammar: string = new Grammar().toString();
const error: string | undefined = new CookieParseError('message').cookieString;

// @ts-expect-error cookie string must be a string
parseCookie(1);

const decoded: ASTNode | undefined = parseCookie('foo=Ow', {
  decoders: { value: cookieValueRotatingDecoder },
}).tree;
const decoder = createCookieValueRotatingDecoder([cookieValueBase64urlDecoder]);
const translator = new ASTTranslator({ decoders: { value: decoder } });
