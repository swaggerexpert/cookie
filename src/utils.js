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

export const identity = (a) => a;

export const noop = () => {};
