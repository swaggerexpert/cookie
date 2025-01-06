import { assert } from 'chai';
import { cookieNameStrictEncoder } from '../../../../src/index.js';

describe('cookieNameStrictEncoder', function () {
  context('RFC 6265 compliance', () => {
    specify('should preserve valid token characters', () => {
      const valid = "!#$%&'*+-.^_`|~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      assert.strictEqual(cookieNameStrictEncoder(valid), valid);
    });

    specify('should encode invalid characters', () => {
      assert.strictEqual(cookieNameStrictEncoder(' '), '%20'); // Space
      assert.strictEqual(cookieNameStrictEncoder(';'), '%3B'); // Semicolon
      assert.strictEqual(cookieNameStrictEncoder('('), '%28'); // Left parenthesis
      assert.strictEqual(cookieNameStrictEncoder(')'), '%29'); // Right parenthesis
      assert.strictEqual(cookieNameStrictEncoder('\\'), '%5C'); // Backslash
      assert.strictEqual(cookieNameStrictEncoder('"'), '%22'); // Double quote
    });

    specify('should handle empty strings', () => {
      assert.strictEqual(cookieNameStrictEncoder(''), '');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieNameStrictEncoder('π'), '%CF%80');
      assert.strictEqual(cookieNameStrictEncoder('★'), '%E2%98%85');
      assert.strictEqual(cookieNameStrictEncoder('🌟'), '%F0%9F%8C%9F');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieNameStrictEncoder('abc★def'), 'abc%E2%98%85def');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieNameStrictEncoder(123), '123');
      assert.strictEqual(cookieNameStrictEncoder(0), '0');
      assert.strictEqual(cookieNameStrictEncoder(null), 'null');
      assert.strictEqual(cookieNameStrictEncoder(undefined), 'undefined');
      assert.strictEqual(cookieNameStrictEncoder(true), 'true');
      assert.strictEqual(cookieNameStrictEncoder(false), 'false');
      assert.strictEqual(cookieNameStrictEncoder({}), '%5Bobject%20Object%5D');
      assert.strictEqual(cookieNameStrictEncoder([1, 2, 3]), '1%2C2%2C3');
    });

    specify('should encode control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieNameStrictEncoder(char),
          encodeURIComponent(char),
          `Control character ${i} should be encoded`,
        );
      }
      assert.strictEqual(cookieNameStrictEncoder(String.fromCharCode(127)), '%7F'); // DEL
    });
  });

  context('Boundary cases', () => {
    specify('should handle strings with special characters', () => {
      assert.strictEqual(cookieNameStrictEncoder('!foo'), '!foo');
      assert.strictEqual(cookieNameStrictEncoder('#foo$bar'), '#foo$bar');
      assert.strictEqual(cookieNameStrictEncoder(';foo:bar'), '%3Bfoo%3Abar');
    });

    specify('should handle repeated invalid characters', () => {
      assert.strictEqual(cookieNameStrictEncoder(',,,,'), '%2C%2C%2C%2C');
      assert.strictEqual(cookieNameStrictEncoder(';;;;'), '%3B%3B%3B%3B');
      assert.strictEqual(cookieNameStrictEncoder('    '), '%20%20%20%20');
    });
  });
});
