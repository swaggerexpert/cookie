export type CookieName = string;
export type CookieValue = string;
export type CookieString = string;
export type CookiePair = [CookieName, CookieValue];

/**
 * Cookie - parse
 */
export function parseCookie(
  cookieString: CookieString,
  options?: ParseOptions & { readonly translator?: ASTTranslator },
): ParseResult<ASTNode>;
export function parseCookie<TTree>(
  cookieString: CookieString,
  options: ParseOptions & { readonly translator: Translator<TTree> },
): ParseResult<TTree>;
export function parseCookie(
  cookieString: CookieString,
  options: ParseOptions & { readonly translator: null },
): ParseResult<undefined>;
export function parseCookie(
  cookieString: CookieString,
  options?: ParseOptions,
): ParseResult<unknown>;

export interface ParseOptions {
  readonly strict?: boolean;
  /**
   * Decoders applied to cookie names and values of the AST produced by the default translator.
   * Ignored when `translator` option is provided; use `new ASTTranslator({ decoders })` instead.
   */
  readonly decoders?: ParseDecoders;
  readonly translator?: Translator | null;
  readonly stats?: boolean;
  readonly trace?: boolean;
}

/**
 * Translators are apg-lite AST instances. Custom translators must extend
 * one of the provided translator classes rather than implement this interface from scratch.
 */
export interface Translator<TTree = unknown> {
  getTree(): TTree;
  init(rules: unknown, udts: unknown, chars: unknown): void;
  ruleDefined(index: number): boolean;
  udtDefined(index: number): boolean;
  down(callbackIndex: number, name: string): void;
  up(callbackIndex: number, name: string, phraseIndex: number, phraseLength: number): void;
  translate(data: unknown): void;
  setLength(length: number): void;
  getLength(): number;
  toXml(): string;
}

declare abstract class AST<TTree> implements Translator<TTree> {
  abstract getTree(): TTree;
  init(rules: unknown, udts: unknown, chars: unknown): void;
  ruleDefined(index: number): boolean;
  udtDefined(index: number): boolean;
  down(callbackIndex: number, name: string): void;
  up(callbackIndex: number, name: string, phraseIndex: number, phraseLength: number): void;
  translate(data: unknown): void;
  setLength(length: number): void;
  getLength(): number;
  toXml(): string;
}

export declare class ListTranslator extends AST<ListTree> {
  getTree(): ListTree;
  /**
   * @deprecated use `getTree()` instead
   */
  translate(parts: unknown[]): void;
}
export declare class CSTTranslator extends AST<CSTNode> {
  getTree(): CSTNode;
}
/**
 * Produces CookieStringNode (ASTNode) when used with parseCookie
 * and SetCookieASTNode when used with parseSetCookie, e.g. `new ASTTranslator<SetCookieASTNode>()`.
 */
export declare class ASTTranslator<TTree extends ASTNode | SetCookieASTNode = ASTNode> extends AST<TTree> {
  constructor(options?: ASTTranslatorOptions);
  getTree(): TTree;
}

export interface ASTTranslatorOptions {
  readonly decoders?: ParseDecoders;
}

export interface ParseDecoders {
  readonly name?: CookieNameDecoder;
  readonly value?: CookieValueDecoder;
}
export declare class XMLTranslator extends AST<XMLTree> {
  getTree(): XMLTree;
}
/**
 * Translates cookie pairs into an object (with null prototype) mapping cookie names to cookie values.
 * When cookie name appears multiple times, the first cookie value wins.
 * At runtime, ObjectTranslator extends EntriesTranslator, which extends ASTTranslator. The typings don't express
 * the hierarchy, as getTree() return types are incompatible and ASTTranslator type parameter is constrained to AST nodes.
 */
export declare class ObjectTranslator extends AST<ObjectTree> {
  constructor(options?: ASTTranslatorOptions);
  getTree(): ObjectTree;
}
/**
 * Object with null prototype. Lookups of absent cookie names are undefined at runtime;
 * enable `noUncheckedIndexedAccess` compiler option to reflect that in types.
 * Object.prototype members (e.g. `toString`, `hasOwnProperty`) are NOT available at runtime.
 */
export type ObjectTree = Record<CookieName, CookieValue>;
/**
 * Translates cookie pairs into a list of [name, value] entries, in order of appearance.
 * All cookie pairs are retained, including duplicate cookie names.
 * At runtime, EntriesTranslator extends ASTTranslator (see ObjectTranslator).
 */
export declare class EntriesTranslator extends AST<EntriesTree> {
  constructor(options?: ASTTranslatorOptions);
  getTree(): EntriesTree;
}
export type EntriesTree = CookiePair[];

export type ListEntryType = 'cookie-string' | 'cookie-pair' | 'cookie-name' | 'cookie-value';
export type ListEntry = [ListEntryType, string];
export type ListTree = ListEntry[];

export interface CSTNode {
  readonly type: ListEntryType;
  readonly text: string;
  readonly start: number;
  readonly length: number;
  readonly children: CSTNode[];
}

export interface CookiePairNode {
  readonly type: 'CookiePair';
  readonly name: CookieName;
  /**
   * Raw cookie value as it appears in the cookie string, including the surrounding DQUOTEs if present.
   */
  readonly value: CookieValue;
}
export interface CookieStringNode {
  readonly type: 'CookieString';
  readonly pairs: CookiePairNode[];
}
export type ASTNode = CookieStringNode;

export type XMLTree = string;

export interface ParseResult<TTree = ASTNode> extends BaseParseResult<TTree> {
  /**
   * @deprecated retained for backward compatibility, use `tree` instead
   */
  readonly ast: LegacyAST & ListTranslator;
}

export interface BaseParseResult<TTree> {
  readonly result: {
    readonly success: boolean;
    readonly state: number;
    readonly stateName: string;
    readonly length: number;
    readonly matched: number;
    readonly maxMatched: number;
    readonly maxTreeDepth: number;
    readonly nodeHits: number;
  };
  readonly tree?: TTree;
  readonly stats?: Stats;
  readonly trace?: Trace;
}

/**
 * @deprecated retained for backward compatibility, use `ListTranslator` instead
 */
export interface LegacyAST {
  readonly translate: (parts: CookiePair[]) => CookiePair[];
  readonly toXml: () => string;
}

export interface Stats {
  displayStats(): string;
  displayHits(): string;
}

export declare class Trace {
  displayTrace(): string;
  inferExpectations(): Expectations;
}

export interface Expectations extends Array<string> {
  toString(): string;
}

/**
 * Errors
 */
export declare class CookieError extends Error {
  constructor(message?: string, options?: CookieErrorOptions);
}
export interface CookieErrorOptions {
  readonly cause?: unknown;
  readonly [key: string]: unknown;
}
export declare class CookieParseError extends CookieError {
  readonly cookieString?: CookieString;
}

/**
 * Cookie - test
 */
export function testCookie(cookieString: CookieString, options?: TestOptions): boolean;

export interface TestOptions {
  readonly strict?: boolean;
}

export function testCookieName(cookieName: CookieName, options?: TestOptions): boolean;
export function testCookieValue(cookieValue: CookieValue, options?: TestCookieValueOptions): boolean;

export interface TestCookieValueOptions extends TestOptions {
  /**
   * When `true`, value must be enclosed in DQUOTEs; when `false`, value must not be enclosed in DQUOTEs.
   * When `null` (default), both forms are allowed.
   */
  readonly quoted?: boolean | null;
}

/**
 * Cookie - serialize
 */
export function serializeCookie(cookiePairs: CookiePair[], options?: CookieSerializeOptions): CookieString;
export function serializeCookie(cookies: Record<CookieName, CookieValue>, options?: CookieSerializeOptions): CookieString;

export interface CookieSerializeOptions {
  encoders?: {
    name?: CookieNameEncoder;
    value?: CookieValueEncoder;
  },
  validators?: {
    name?: CookieNameValidator;
    value?: CookieValueValidator;
  }
}

/**
 * Set-Cookie - parse
 */
export type SetCookieString = string;

export function parseSetCookie(
  setCookieString: SetCookieString,
  options?: ParseOptions & { readonly translator?: ASTTranslator<ASTNode | SetCookieASTNode> },
): SetCookieParseResult<SetCookieASTNode>;
export function parseSetCookie(
  setCookieString: SetCookieString,
  options: ParseOptions & { readonly translator: CSTTranslator },
): SetCookieParseResult<SetCookieCSTNode>;
export function parseSetCookie(
  setCookieString: SetCookieString,
  options: ParseOptions & { readonly translator: ListTranslator },
): SetCookieParseResult<SetCookieListTree>;
export function parseSetCookie<TTree>(
  setCookieString: SetCookieString,
  options: ParseOptions & { readonly translator: Translator<TTree> },
): SetCookieParseResult<TTree>;
export function parseSetCookie(
  setCookieString: SetCookieString,
  options: ParseOptions & { readonly translator: null },
): SetCookieParseResult<undefined>;
export function parseSetCookie(
  setCookieString: SetCookieString,
  options?: ParseOptions,
): SetCookieParseResult<unknown>;

export interface SetCookieParseResult<TTree = SetCookieASTNode> extends BaseParseResult<TTree> {}

export type SetCookieListEntryType =
  | 'set-cookie-string'
  | 'cookie-pair'
  | 'cookie-name'
  | 'cookie-value'
  | 'cookie-av';
export type SetCookieListEntry = [SetCookieListEntryType, string];
export type SetCookieListTree = SetCookieListEntry[];

export interface SetCookieCSTNode {
  readonly type: SetCookieListEntryType;
  readonly text: string;
  readonly start: number;
  readonly length: number;
  readonly children: SetCookieCSTNode[];
}

export interface SetCookieASTNode {
  readonly type: 'SetCookie';
  readonly name: CookieName;
  /**
   * Raw cookie value as it appears in the Set-Cookie string (unless decoded by decoders option).
   */
  readonly value: CookieValue;
  /**
   * Recognized attributes, interpreted following RFC 6265, Section 5.2.
   * Attributes with values that cannot be processed are omitted. When attribute appears multiple times, the last one wins.
   */
  readonly attributes: SetCookieAttributesNode;
  /**
   * Attributes that are not recognized, in order of appearance.
   */
  readonly extensions: CookieAttributeNode[];
}

export interface SetCookieAttributesNode {
  readonly expires?: Date;
  readonly maxAge?: number;
  /**
   * Lower-cased, without leading ".".
   */
  readonly domain?: string;
  readonly path?: string;
  readonly secure?: true;
  readonly httpOnly?: true;
  readonly sameSite?: 'strict' | 'lax' | 'none';
  readonly partitioned?: true;
  readonly priority?: 'low' | 'medium' | 'high';
}

export interface CookieAttributeNode {
  readonly type: 'CookieAttribute';
  readonly name: string;
  /**
   * Missing when attribute has no "=".
   */
  readonly value?: string;
}

/**
 * Set-Cookie - test
 */
export function testSetCookie(setCookieString: SetCookieString, options?: TestOptions): boolean;

/**
 * Set-Cookie - serialize
 */

export function serializeSetCookie(name: CookieName, value: CookieValue, options?: SetCookieSerializeOptions): SetCookieString;

export interface SetCookieSerializeOptions extends CookieSerializeOptions, SetCookieAttributes {}

export interface SetCookieAttributes {
  /**
   * Expires attribute, serialized as rfc1123-date.
   */
  expires?: Date;
  /**
   * Max-Age attribute in seconds. Must be an integer; zero or negative values mean immediate expiration.
   */
  maxAge?: number;
  /**
   * Domain attribute. Must be a valid subdomain (RFC 1034, RFC 1123); leading "." is tolerated.
   */
  domain?: string;
  /**
   * Path attribute. Any CHAR except CTLs or ";".
   */
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  /**
   * SameSite attribute (not part of RFC 6265). Case-insensitive.
   */
  sameSite?: 'strict' | 'lax' | 'none' | 'Strict' | 'Lax' | 'None';
  /**
   * Partitioned attribute (not part of RFC 6265).
   */
  partitioned?: boolean;
  /**
   * Priority attribute (not part of RFC 6265). Case-insensitive.
   */
  priority?: 'low' | 'medium' | 'high' | 'Low' | 'Medium' | 'High';
}

/**
 * Encoders
 */
export declare const base64Encoder: Encoder;
export declare const base64urlEncoder: Encoder;
export declare const cookieNameStrictPercentEncoder: CookieNameEncoder;
export declare const cookieNameLenientPercentEncoder: CookieNameEncoder;
export declare const cookieValueStrictPercentEncoder: CookieValueEncoder;
export declare const cookieValueStrictBase64Encoder: CookieValueEncoder;
export declare const cookieValueStrictBase64urlEncoder: CookieValueEncoder;
export declare const cookieValueLenientPercentEncoder: CookieValueEncoder;
export declare const cookieValueLenientBase64Encoder: CookieValueEncoder;
export declare const cookieValueLenientBase64urlEncoder: CookieValueEncoder;
export interface Encoder {
  (value: string): string
}
export interface CookieNameEncoder extends Encoder {
  (value: CookieName): string
}
export interface CookieValueEncoder extends Encoder {
  (value: CookieValue): string
}

/**
 * Decoders
 */
export declare const base64Decoder: Decoder;
export declare const base64urlDecoder: Decoder;
export declare const cookieNamePercentDecoder: CookieNameDecoder;
export declare const cookieValuePercentDecoder: CookieValueDecoder;
export declare const cookieValueBase64Decoder: CookieValueDecoder;
export declare const cookieValueBase64urlDecoder: CookieValueDecoder;
export declare const cookieValueRotatingDecoder: CookieValueDecoder;
export function createCookieValueRotatingDecoder(decoders: CookieValueDecoder[]): CookieValueDecoder;
export interface Decoder {
  (value: string): string
}
export interface CookieNameDecoder extends Decoder {
  (value: CookieName): string
}
export interface CookieValueDecoder extends Decoder {
  (value: CookieValue): string
}

/**
 * Validators
 */
export declare const cookieNameStrictValidator: CookieNameValidator;
export declare const cookieNameLenientValidator: CookieNameValidator;
export declare const cookieValueStrictValidator: CookieValueValidator;
export declare const cookieValueLenientValidator: CookieValueValidator;
export interface Validator {
  (value: string): void;
}
export interface CookieNameValidator extends Validator {
  (value: CookieName): void;
}
export interface CookieValueValidator extends Validator {
  (value: CookieValue): void;
}

/**
 * Utils
 */
export function identity<T>(value: T): T;
export function noop(...args: any[]): void;

/**
 * Grammar
 */
export declare const Grammar: {
  new (): Grammar;
};
export interface Grammar {
  grammarObject: string; // Internal identifier
  rules: Rule[]; // List of grammar rules
  udts: UDT[]; // User-defined terminals (empty in this grammar)
  toString(): string; // Method to return the grammar in ABNF format
}

export interface Rule {
  name: string; // Rule name
  lower: string; // Lowercased rule name
  index: number; // Rule index
  isBkr: boolean; // Is this a back-reference?
  opcodes?: Opcode[]; // List of opcodes for the rule
}

export type Opcode =
  | { type: 1; children: number[] } // ALT (alternation)
  | { type: 2; children: number[] } // CAT (concatenation)
  | { type: 3; min: number; max: number } // REP (repetition)
  | { type: 4; index: number } // RNM (rule reference)
  | { type: 5; min: number; max: number } // TRG (terminal range)
  | { type: 6 | 7; string: number[] }; // TBS or TLS (byte sequence or literal string)

export type UDT = {}; // User-defined terminals (empty in this grammar)
