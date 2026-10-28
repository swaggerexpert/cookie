import cookieValueBase64urlDecoder from './cookie-value-base64url.js';
import cookieValueBase64Decoder from './cookie-value-base64.js';
import cookieValuePercentDecoder from './cookie-value-percent.js';

// eslint-disable-next-line no-control-regex
const hasControlChars = (value) => /[\u0000-\u0008\u000A-\u001F\u007F]/.test(value);

/**
 * Creates a decoder which tries the provided decoders in order and returns the result
 * of the first one that succeeds. Results containing control characters are considered
 * as false positives (e.g. a plain value that happens to be valid base64). When no decoder
 * succeeds, the cookie value is returned as is.
 *
 * NOTE: this is a best-effort heuristic. Encoding of a cookie value cannot be reliably detected,
 * as the same value can be valid in multiple encodings (e.g. `Ow` is both plain value and base64url encoded `;`).
 */
export const createCookieValueRotatingDecoder = (decoders) => (cookieValue) => {
  const value = String(cookieValue);

  for (const decoder of decoders) {
    try {
      const result = decoder(value);
      if (!hasControlChars(result)) return result;
    } catch {
      // try next decoder
    }
  }

  return value;
};

const cookieValueRotatingDecoder = createCookieValueRotatingDecoder([
  cookieValueBase64urlDecoder,
  cookieValueBase64Decoder,
  cookieValuePercentDecoder,
]);

export default cookieValueRotatingDecoder;
