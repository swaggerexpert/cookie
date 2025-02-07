import { assert } from 'chai';

import { cookieValueStrictPercentEncoder } from '../../../../src/index.js';

describe('cookieValueStrictPercentEncoder', function () {
  context('RFC 6265 compliance', () => {
    specify('should preserve valid cookie-octets', () => {
      const valid =
        "!#$%&'()*+-./0123456789:<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";

      assert.strictEqual(cookieValueStrictPercentEncoder(valid), valid);
    });

    specify('should encode non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder(' '), '%20');
      assert.strictEqual(cookieValueStrictPercentEncoder('"'), '%22');
      assert.strictEqual(cookieValueStrictPercentEncoder('\\'), '%5C');
      assert.strictEqual(cookieValueStrictPercentEncoder(','), '%2C');
      assert.strictEqual(cookieValueStrictPercentEncoder(';'), '%3B');
    });

    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder(''), '');
      assert.strictEqual(cookieValueStrictPercentEncoder('""'), '""');
    });
  });

  context('Quote handling', () => {
    specify('should preserve properly quoted strings', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('"abc"'), '"abc"');
      assert.strictEqual(cookieValueStrictPercentEncoder('"!#$"'), '"!#$"');
    });

    specify('should handle quoted strings containing non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('"a b c"'), '"a%20b%20c"');
      assert.strictEqual(cookieValueStrictPercentEncoder('"a,b;c"'), '"a%2Cb%3Bc"');
    });

    specify('should handle strings with unmatched quotes', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('abc"'), 'abc%22');
      assert.strictEqual(cookieValueStrictPercentEncoder('"abc'), '%22abc');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('π'), '%CF%80');
      assert.strictEqual(cookieValueStrictPercentEncoder('★'), '%E2%98%85');
      assert.strictEqual(cookieValueStrictPercentEncoder('🌟'), '%F0%9F%8C%9F');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('abc★def'), 'abc%E2%98%85def');
      assert.strictEqual(cookieValueStrictPercentEncoder('"abc★def"'), '"abc%E2%98%85def"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder(123), '123');
      assert.strictEqual(cookieValueStrictPercentEncoder(0), '0');
      assert.strictEqual(cookieValueStrictPercentEncoder(null), 'null');
      assert.strictEqual(cookieValueStrictPercentEncoder(undefined), 'undefined');
      assert.strictEqual(cookieValueStrictPercentEncoder(true), 'true');
      assert.strictEqual(cookieValueStrictPercentEncoder(false), 'false');
      assert.strictEqual(cookieValueStrictPercentEncoder({}), '[object%20Object]');
      assert.strictEqual(cookieValueStrictPercentEncoder([1, 2, 3]), '1%2C2%2C3');
    });

    specify('should handle strings with multiple spaces and special characters', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('a  b'), 'a%20%20b');
      assert.strictEqual(cookieValueStrictPercentEncoder('a\tb'), 'a%09b');
      assert.strictEqual(cookieValueStrictPercentEncoder('a\nb'), 'a%0Ab');
      assert.strictEqual(cookieValueStrictPercentEncoder('a\rb'), 'a%0Db');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueStrictPercentEncoder(char),
          encodeURIComponent(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle strings with quotes and spaces', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder(' "abc" '), '%20%22abc%22%20');
      assert.strictEqual(cookieValueStrictPercentEncoder('" abc "'), '"%20abc%20"');
      assert.strictEqual(cookieValueStrictPercentEncoder('"""'), '"%22"');
    });

    specify('should handle minimal quoted strings', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder('""'), '""');
      assert.strictEqual(cookieValueStrictPercentEncoder('"a"'), '"a"');
    });

    specify('should handle repeated special characters', () => {
      assert.strictEqual(cookieValueStrictPercentEncoder(',,,,'), '%2C%2C%2C%2C');
      assert.strictEqual(cookieValueStrictPercentEncoder(';;;;'), '%3B%3B%3B%3B');
      assert.strictEqual(cookieValueStrictPercentEncoder('    '), '%20%20%20%20');
    });
  });
});
