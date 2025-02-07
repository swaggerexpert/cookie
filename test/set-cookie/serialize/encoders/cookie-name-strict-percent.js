import { assert } from 'chai';
import { cookieNameStrictPercentEncoder } from '../../../../src/index.js';

describe('cookieNameStrictPercentEncoder', function () {
  context('RFC 6265 compliance', () => {
    specify('should preserve valid token characters', () => {
      const valid = "!#$%&'*+-.^_`|~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      assert.strictEqual(cookieNameStrictPercentEncoder(valid), valid);
    });

    specify('should encode invalid characters', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder(' '), '%20'); // Space
      assert.strictEqual(cookieNameStrictPercentEncoder(';'), '%3B'); // Semicolon
      assert.strictEqual(cookieNameStrictPercentEncoder('('), '%28'); // Left parenthesis
      assert.strictEqual(cookieNameStrictPercentEncoder(')'), '%29'); // Right parenthesis
      assert.strictEqual(cookieNameStrictPercentEncoder('\\'), '%5C'); // Backslash
      assert.strictEqual(cookieNameStrictPercentEncoder('"'), '%22'); // Double quote
    });

    specify('should handle empty strings', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder(''), '');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder('π'), '%CF%80');
      assert.strictEqual(cookieNameStrictPercentEncoder('★'), '%E2%98%85');
      assert.strictEqual(cookieNameStrictPercentEncoder('🌟'), '%F0%9F%8C%9F');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder('abc★def'), 'abc%E2%98%85def');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder(123), '123');
      assert.strictEqual(cookieNameStrictPercentEncoder(0), '0');
      assert.strictEqual(cookieNameStrictPercentEncoder(null), 'null');
      assert.strictEqual(cookieNameStrictPercentEncoder(undefined), 'undefined');
      assert.strictEqual(cookieNameStrictPercentEncoder(true), 'true');
      assert.strictEqual(cookieNameStrictPercentEncoder(false), 'false');
      assert.strictEqual(cookieNameStrictPercentEncoder({}), '%5Bobject%20Object%5D');
      assert.strictEqual(cookieNameStrictPercentEncoder([1, 2, 3]), '1%2C2%2C3');
    });

    specify('should encode control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieNameStrictPercentEncoder(char),
          encodeURIComponent(char),
          `Control character ${i} should be encoded`,
        );
      }
      assert.strictEqual(cookieNameStrictPercentEncoder(String.fromCharCode(127)), '%7F'); // DEL
    });
  });

  context('Boundary cases', () => {
    specify('should handle strings with special characters', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder('!foo'), '!foo');
      assert.strictEqual(cookieNameStrictPercentEncoder('#foo$bar'), '#foo$bar');
      assert.strictEqual(cookieNameStrictPercentEncoder(';foo:bar'), '%3Bfoo%3Abar');
    });

    specify('should handle repeated invalid characters', () => {
      assert.strictEqual(cookieNameStrictPercentEncoder(',,,,'), '%2C%2C%2C%2C');
      assert.strictEqual(cookieNameStrictPercentEncoder(';;;;'), '%3B%3B%3B%3B');
      assert.strictEqual(cookieNameStrictPercentEncoder('    '), '%20%20%20%20');
    });
  });
});
