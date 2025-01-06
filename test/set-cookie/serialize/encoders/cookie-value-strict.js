import { assert } from 'chai';

import { cookieValueStrictEncoder } from '../../../../src/index.js';

describe('cookieValueStrictEncoder', function () {
  context('RFC 6265 compliance', () => {
    specify('should preserve valid cookie-octets', () => {
      const valid =
        "!#$%&'()*+-./0123456789:<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";

      assert.strictEqual(cookieValueStrictEncoder(valid), valid);
    });

    specify('should encode non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictEncoder(' '), '%20');
      assert.strictEqual(cookieValueStrictEncoder('"'), '%22');
      assert.strictEqual(cookieValueStrictEncoder('\\'), '%5C');
      assert.strictEqual(cookieValueStrictEncoder(','), '%2C');
      assert.strictEqual(cookieValueStrictEncoder(';'), '%3B');
    });

    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueStrictEncoder(''), '');
      assert.strictEqual(cookieValueStrictEncoder('""'), '""');
    });
  });

  context('Quote handling', () => {
    specify('should preserve properly quoted strings', () => {
      assert.strictEqual(cookieValueStrictEncoder('"abc"'), '"abc"');
      assert.strictEqual(cookieValueStrictEncoder('"!#$"'), '"!#$"');
    });

    specify('should handle quoted strings containing non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictEncoder('"a b c"'), '"a%20b%20c"');
      assert.strictEqual(cookieValueStrictEncoder('"a,b;c"'), '"a%2Cb%3Bc"');
    });

    specify('should handle strings with unmatched quotes', () => {
      assert.strictEqual(cookieValueStrictEncoder('abc"'), 'abc%22');
      assert.strictEqual(cookieValueStrictEncoder('"abc'), '%22abc');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueStrictEncoder('π'), '%CF%80');
      assert.strictEqual(cookieValueStrictEncoder('★'), '%E2%98%85');
      assert.strictEqual(cookieValueStrictEncoder('🌟'), '%F0%9F%8C%9F');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueStrictEncoder('abc★def'), 'abc%E2%98%85def');
      assert.strictEqual(cookieValueStrictEncoder('"abc★def"'), '"abc%E2%98%85def"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueStrictEncoder(123), '123');
      assert.strictEqual(cookieValueStrictEncoder(0), '0');
      assert.strictEqual(cookieValueStrictEncoder(null), 'null');
      assert.strictEqual(cookieValueStrictEncoder(undefined), 'undefined');
      assert.strictEqual(cookieValueStrictEncoder(true), 'true');
      assert.strictEqual(cookieValueStrictEncoder(false), 'false');
      assert.strictEqual(cookieValueStrictEncoder({}), '[object%20Object]');
      assert.strictEqual(cookieValueStrictEncoder([1, 2, 3]), '1%2C2%2C3');
    });

    specify('should handle strings with multiple spaces and special characters', () => {
      assert.strictEqual(cookieValueStrictEncoder('a  b'), 'a%20%20b');
      assert.strictEqual(cookieValueStrictEncoder('a\tb'), 'a%09b');
      assert.strictEqual(cookieValueStrictEncoder('a\nb'), 'a%0Ab');
      assert.strictEqual(cookieValueStrictEncoder('a\rb'), 'a%0Db');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueStrictEncoder(char),
          encodeURIComponent(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle strings with quotes and spaces', () => {
      assert.strictEqual(cookieValueStrictEncoder(' "abc" '), '%20%22abc%22%20');
      assert.strictEqual(cookieValueStrictEncoder('" abc "'), '"%20abc%20"');
      assert.strictEqual(cookieValueStrictEncoder('"""'), '"%22"');
    });

    specify('should handle minimal quoted strings', () => {
      assert.strictEqual(cookieValueStrictEncoder('""'), '""');
      assert.strictEqual(cookieValueStrictEncoder('"a"'), '"a"');
    });

    specify('should handle repeated special characters', () => {
      assert.strictEqual(cookieValueStrictEncoder(',,,,'), '%2C%2C%2C%2C');
      assert.strictEqual(cookieValueStrictEncoder(';;;;'), '%3B%3B%3B%3B');
      assert.strictEqual(cookieValueStrictEncoder('    '), '%20%20%20%20');
    });
  });
});
