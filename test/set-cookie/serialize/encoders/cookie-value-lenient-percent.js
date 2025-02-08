import { assert } from 'chai';
import { cookieValueLenientPercentEncoder } from '../../../../src/index.js';

describe('cookieValueLenientPercentEncoder', function () {
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

      assert.strictEqual(cookieValueLenientPercentEncoder(valid), valid);
    });

    specify('should encode non-lenient-cookie-octets', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder('"'), '"'); // DQUOTE
      assert.strictEqual(cookieValueLenientPercentEncoder(';'), '%3B'); // semicolon
      assert.strictEqual(cookieValueLenientPercentEncoder(','), '%2C'); // comma (for unquoted)
    });
  });

  context('Quote handling with lenient-quoted-char', () => {
    specify('should preserve valid quoted characters', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder('" !#$%&\'()*+"'), '" !#$%&\'()*+"');
      assert.strictEqual(cookieValueLenientPercentEncoder('"-./0123456789:"'), '"-./0123456789:"');
      assert.strictEqual(cookieValueLenientPercentEncoder('"<=>?@"'), '"<=>?@"');
      assert.strictEqual(
        cookieValueLenientPercentEncoder('"ABCDEFGHIJKLMNOPQRSTUVWXYZ"'),
        '"ABCDEFGHIJKLMNOPQRSTUVWXYZ"',
      );
      assert.strictEqual(cookieValueLenientPercentEncoder('"[\\]^_`"'), '"[\\]^_`"');
      assert.strictEqual(
        cookieValueLenientPercentEncoder('"abcdefghijklmnopqrstuvwxyz"'),
        '"abcdefghijklmnopqrstuvwxyz"',
      );
      assert.strictEqual(cookieValueLenientPercentEncoder('"{|}~"'), '"{|}~"');
    });

    specify('should handle spaces in quoted strings', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder('" abc "'), '" abc "');
      assert.strictEqual(cookieValueLenientPercentEncoder('"   "'), '"   "');
    });

    specify('should handle special characters in quoted strings', () => {
      // assert.strictEqual(cookieValueLenientPercentEncoder('"a,b"'), '"a,b"'); // comma allowed in quotes
      // assert.strictEqual(cookieValueLenientPercentEncoder('"a;b"'), '"a;b"'); // semicolon always encoded
      // assert.strictEqual(cookieValueLenientPercentEncoder('"a\\b"'), '"a\\b"'); // backslash allowed in quotes
      assert.strictEqual(cookieValueLenientPercentEncoder('"""'), '"%22"');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder('"π"'), '"%CF%80"');
      assert.strictEqual(cookieValueLenientPercentEncoder('"★"'), '"%E2%98%85"');
      assert.strictEqual(cookieValueLenientPercentEncoder('"🌟"'), '"%F0%9F%8C%9F"');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder('abc★def'), 'abc%E2%98%85def');
      assert.strictEqual(cookieValueLenientPercentEncoder('"abc★def"'), '"abc%E2%98%85def"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder(123), '123');
      assert.strictEqual(cookieValueLenientPercentEncoder(null), 'null');
      assert.strictEqual(cookieValueLenientPercentEncoder(undefined), 'undefined');
      assert.strictEqual(cookieValueLenientPercentEncoder([1, 2, 3]), '1%2C2%2C3');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueLenientPercentEncoder(char),
          encodeURIComponent(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder(''), '');
      assert.strictEqual(cookieValueLenientPercentEncoder('""'), '""');
    });

    specify('should handle unmatched quotes', () => {
      assert.strictEqual(cookieValueLenientPercentEncoder('"abc'), '"abc');
      assert.strictEqual(cookieValueLenientPercentEncoder('abc"'), 'abc"');
      assert.strictEqual(cookieValueLenientPercentEncoder('"'), '"');
    });
  });
});
