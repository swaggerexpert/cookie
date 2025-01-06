import { assert } from 'chai';
import { cookieValueLenientEncoder } from '../../../../src/index.js';

describe('cookieValueLenientEncoder', function () {
  context('RFC 6265 lenient compliance', () => {
    specify('should preserve valid lenient-cookie-octets', () => {
      const valid =
        "!#$%&'()*+" + // %x20-2B
        '-./0123456789:' + // %x2D-3A
        '<=>?@' + // %x3C-40
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + // %x41-5A
        '[\\]^_`' + // %x5B-60
        'abcdefghijklmnopqrstuvwxyz' + // %x61-7A
        '{|}~'; // %x7B-7E

      assert.strictEqual(cookieValueLenientEncoder(valid), valid);
    });

    specify('should encode non-lenient-cookie-octets', () => {
      assert.strictEqual(cookieValueLenientEncoder('"'), '"'); // DQUOTE
      assert.strictEqual(cookieValueLenientEncoder(';'), '%3B'); // semicolon
      assert.strictEqual(cookieValueLenientEncoder(','), '%2C'); // comma (for unquoted)
    });
  });

  context('Quote handling with lenient-quoted-char', () => {
    specify('should preserve valid quoted characters', () => {
      assert.strictEqual(cookieValueLenientEncoder('" !#$%&\'()*+"'), '" !#$%&\'()*+"');
      assert.strictEqual(cookieValueLenientEncoder('"-./0123456789:"'), '"-./0123456789:"');
      assert.strictEqual(cookieValueLenientEncoder('"<=>?@"'), '"<=>?@"');
      assert.strictEqual(
        cookieValueLenientEncoder('"ABCDEFGHIJKLMNOPQRSTUVWXYZ"'),
        '"ABCDEFGHIJKLMNOPQRSTUVWXYZ"',
      );
      assert.strictEqual(cookieValueLenientEncoder('"[\\]^_`"'), '"[\\]^_`"');
      assert.strictEqual(
        cookieValueLenientEncoder('"abcdefghijklmnopqrstuvwxyz"'),
        '"abcdefghijklmnopqrstuvwxyz"',
      );
      assert.strictEqual(cookieValueLenientEncoder('"{|}~"'), '"{|}~"');
    });

    specify('should handle spaces in quoted strings', () => {
      assert.strictEqual(cookieValueLenientEncoder('" abc "'), '" abc "');
      assert.strictEqual(cookieValueLenientEncoder('"   "'), '"   "');
    });

    specify('should handle special characters in quoted strings', () => {
      assert.strictEqual(cookieValueLenientEncoder('"a,b"'), '"a,b"'); // comma allowed in quotes
      assert.strictEqual(cookieValueLenientEncoder('"a;b"'), '"a;b"'); // semicolon always encoded
      assert.strictEqual(cookieValueLenientEncoder('"a\\b"'), '"a\\b"'); // backslash allowed in quotes
      assert.strictEqual(cookieValueLenientEncoder('"""'), '"%22"');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueLenientEncoder('"π"'), '"%CF%80"');
      assert.strictEqual(cookieValueLenientEncoder('"★"'), '"%E2%98%85"');
      assert.strictEqual(cookieValueLenientEncoder('"🌟"'), '"%F0%9F%8C%9F"');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueLenientEncoder('abc★def'), 'abc%E2%98%85def');
      assert.strictEqual(cookieValueLenientEncoder('"abc★def"'), '"abc%E2%98%85def"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueLenientEncoder(123), '123');
      assert.strictEqual(cookieValueLenientEncoder(null), 'null');
      assert.strictEqual(cookieValueLenientEncoder(undefined), 'undefined');
      assert.strictEqual(cookieValueLenientEncoder([1, 2, 3]), '1%2C2%2C3');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueLenientEncoder(char),
          encodeURIComponent(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueLenientEncoder(''), '');
      assert.strictEqual(cookieValueLenientEncoder('""'), '""');
    });

    specify('should handle unmatched quotes', () => {
      assert.strictEqual(cookieValueLenientEncoder('"abc'), '"abc');
      assert.strictEqual(cookieValueLenientEncoder('abc"'), 'abc"');
      assert.strictEqual(cookieValueLenientEncoder('"'), '"');
    });
  });
});
