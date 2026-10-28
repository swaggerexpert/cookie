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

export interface ParseOptions {
  readonly strict?: boolean;
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
export declare class ASTTranslator extends AST<ASTNode> {
  getTree(): ASTNode;
}
export declare class XMLTranslator extends AST<XMLTree> {
  getTree(): XMLTree;
}

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

export interface ParseResult<TTree = ASTNode> {
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
  /**
   * @deprecated retained for backward compatibility, use `tree` instead
   */
  readonly ast: LegacyAST & ListTranslator;
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
 * Set-Cookie - serialize
 */
export type SetCookieString = string;

export function serializeSetCookie(name: CookieName, value: CookieValue, options?: SetCookieSerializeOptions): SetCookieString;

export interface SetCookieSerializeOptions extends CookieSerializeOptions {}

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
