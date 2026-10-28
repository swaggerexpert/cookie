// Type checks of the published typings from a CommonJS consumer.
import {
  parseCookie,
  testCookie,
  testCookieName,
  testCookieValue,
  serializeCookie,
  serializeSetCookie,
  parseSetCookie,
  testSetCookie,
  type SetCookieASTNode,
  type SetCookieString,
  Grammar,
  CSTTranslator,
  ListTranslator,
  ObjectTranslator,
  EntriesTranslator,
  type EntriesTree,
  type ObjectTree,
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

const setCookieWithAttributes: SetCookieString = serializeSetCookie('foo', 'bar', {
  expires: new Date(0),
  maxAge: 0,
  domain: 'example.com',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  partitioned: true,
  priority: 'high',
});
// @ts-expect-error unknown SameSite value
serializeSetCookie('foo', 'bar', { sameSite: 'bogus' });

const parsedSetCookie: SetCookieASTNode | undefined = parseSetCookie('id=a; Max-Age=0', {
  strict: false,
}).tree;
const maxAge: number | undefined = parsedSetCookie?.attributes.maxAge;
const validSetCookie: boolean = testSetCookie('id=a; Secure');
if (parsedSetCookie) {
  serializeSetCookie(parsedSetCookie.name, parsedSetCookie.value, parsedSetCookie.attributes);
}

const setCookieTranslator = new ASTTranslator<SetCookieASTNode>();
const setCookieTree: SetCookieASTNode | undefined = parseSetCookie('id=a', {
  translator: setCookieTranslator,
}).tree;
const cookieTree: ASTNode = new ASTTranslator().getTree();

const cookieObject: ObjectTree | undefined = parseCookie('a=1', {
  translator: new ObjectTranslator({ decoders: { value: cookieValueRotatingDecoder } }),
}).tree;
const setCookieObject: ObjectTree | undefined = parseSetCookie('id=a', {
  translator: new ObjectTranslator(),
}).tree;

const cookieEntries: EntriesTree | undefined = parseCookie('a=1; a=2', {
  translator: new EntriesTranslator(),
}).tree;
if (cookieEntries) serializeCookie(cookieEntries);
if (cookieObject) serializeCookie(cookieObject);

// translators with incompatible trees are not assignable to each other
const entriesTranslator = new EntriesTranslator();
const objectTranslator = new ObjectTranslator();
// @ts-expect-error ASTTranslator produces AST nodes only
new ASTTranslator<string>();
// @ts-expect-error ASTTranslator produces AST nodes only
new ASTTranslator<EntriesTree>();
// union-typed translators resolve to catch-all overload
declare const unionTranslator: EntriesTranslator | ObjectTranslator;
const unionTree: unknown = parseCookie('a=1', { translator: unionTranslator }).tree;
const unionSetCookieTree: unknown = parseSetCookie('a=1', { translator: unionTranslator }).tree;
// overload resolution
const entriesTree: EntriesTree | undefined = parseCookie('a=1', {
  translator: entriesTranslator,
}).tree;
const objectTree: ObjectTree | undefined = parseSetCookie('a=1', {
  translator: objectTranslator,
}).tree;
const defaultTree: ASTNode | undefined = parseCookie('a=1').tree;
const defaultSetCookieTree: SetCookieASTNode | undefined = parseSetCookie('a=1').tree;
// @ts-expect-error EntriesTranslator does not produce AST
const wrongTree: ASTNode | undefined = parseCookie('a=1', {
  translator: new EntriesTranslator(),
}).tree;
// @ts-expect-error ObjectTranslator does not produce AST
const wrongObjectTree: ASTNode | undefined = parseCookie('a=1', {
  translator: new ObjectTranslator(),
}).tree;
const inlineEntries: EntriesTree | undefined = parseCookie('a=1', {
  translator: new EntriesTranslator(),
}).tree;
const inlineObject: ObjectTree | undefined = parseSetCookie('a=1', {
  translator: new ObjectTranslator(),
}).tree;
