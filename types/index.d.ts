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


export interface ParseResult {
  readonly result: {
    readonly success: boolean;
  }
  readonly ast: {
    readonly translate: (parts: CookiePair[]) => CookiePair[];
    readonly toXml: () => string;
  };
}

export interface ParseOptions {
  readonly strict?: boolean;
}

export type CookieName = string;
export type CookieValue = string;
export type CookieString = string;
export type Encoder = (value: string) => string;
export type Validator = (value: string) => void;
export type CookiePair = [CookieName, CookieValue];

export interface CookieSerializeOptions {
  encoders?: {
    name?: Encoder;
    value?: Encoder;
  },
  validators?: {
    name?: Validator;
    value?: Validator;
  }
}

// Cookie
export function parseCookie(cookieString: CookieString, options?: ParseOptions): ParseResult;
export function serializeCookie(cookiePairs: CookiePair[], options?: CookieSerializeOptions): CookieString;
export function serializeCookie(cookies: Record<CookieName, CookieValue>, options?: CookieSerializeOptions): CookieString;
// Encoders
export declare const cookieNameStrictEncoder: Encoder;
export declare const cookieNameLenientEncoder: Encoder;
export declare const cookieValueStrictEncoder: Encoder;
export declare const cookieValueLenientEncoder: Encoder;
// Validators
export declare const cookieNameValidator: Validator;
export declare const cookieNameLenientValidator: Validator;
export declare const cookieValueValidator: Validator;
export declare const cookieValueLenientValidator: Validator;
// Utils
export function identity<T>(value: T): T;
export function noop(...args: any[]): void;

export declare const Grammar: {
  new (): Grammar;
};
