export const percentEncodeChar = (char) => {
  if (typeof char !== 'string' || [...char].length !== 1) {
    throw new TypeError('Input must be a single character string.');
  }

  const codePoint = char.codePointAt(0);

  if (codePoint <= 0x7f) {
    // ASCII range: Encode as %XX
    return `%${codePoint.toString(16).toUpperCase().padStart(2, '0')}`;
  } else {
    // Non-ASCII range: Use encodeURIComponent to handle UTF-8 encoding
    return encodeURIComponent(char);
  }
};

export const toBase64url = (base64) => {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export const toBase64 = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return `${base64}${padding}`;
};

export const isQuoted = (value) => {
  return value.length >= 2 && value.startsWith('"') && value.endsWith('"');
};

export const unquote = (value) => {
  return isQuoted(value) ? value.slice(1, -1) : value;
};

export const quote = (value) => {
  return `"${value}"`;
};

export const identity = (a) => a;

export const noop = () => {};

export const isBase64 = (value) =>
  value.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(value) && !/=[^=]/.test(value);

export const isBase64url = (value) => value.length % 4 !== 1 && /^[A-Za-z0-9_-]*$/.test(value);

/**
 * Decodes bytes as UTF-8, throws TypeError on invalid UTF-8 sequences.
 */
export const decodeUTF8 = (bytes) => new TextDecoder('utf-8', { fatal: true }).decode(bytes);
