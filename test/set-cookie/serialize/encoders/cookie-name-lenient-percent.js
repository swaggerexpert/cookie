import { assert } from 'chai';
import { cookieNameLenientPercentEncoder } from '../../../../src/index.js';

describe('cookieNameLenientPercentEncoder', function () {
  context('Allowed characters', () => {
    specify('should preserve all valid characters', () => {
      const valid =
        '!"#$%&\'()*+,-./0123456789:<>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
      assert.strictEqual(cookieNameLenientPercentEncoder(valid), valid);
    });
  });

  context('Disallowed characters', () => {
    specify('should encode "=" character', () => {
      assert.strictEqual(cookieNameLenientPercentEncoder('='), '%3D');
    });

    specify('should encode control characters and whitespace', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieNameLenientPercentEncoder(char),
          `%${i.toString(16).toUpperCase().padStart(2, '0')}`,
          `Control character ${i} should be encoded`,
        );
      }
      assert.strictEqual(cookieNameLenientPercentEncoder(' '), '%20'); // Space
      assert.strictEqual(cookieNameLenientPercentEncoder('\t'), '%09'); // Tab
    });

    specify('should encode non-printable characters with UTF-8', () => {
      for (let i = 127; i < 160; i++) {
        const char = String.fromCharCode(i);
        const utf8Encoded = encodeURIComponent(char);

        assert.strictEqual(
          cookieNameLenientPercentEncoder(char),
          utf8Encoded,
          `Non-printable character ${i} should be encoded as UTF-8`,
        );
      }
    });
  });

  context('Edge cases', () => {
    specify('should handle empty strings', () => {
      assert.strictEqual(cookieNameLenientPercentEncoder(''), '');
    });

    specify('should handle strings with mixed valid and invalid characters', () => {
      assert.strictEqual(cookieNameLenientPercentEncoder('foo=bar'), 'foo%3Dbar');
      assert.strictEqual(cookieNameLenientPercentEncoder('abc def'), 'abc%20def');
      assert.strictEqual(
        cookieNameLenientPercentEncoder('key=value;other=value'),
        'key%3Dvalue%3Bother%3Dvalue',
      );
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieNameLenientPercentEncoder('π'), '%CF%80'); // Greek letter pi
      assert.strictEqual(cookieNameLenientPercentEncoder('★'), '%E2%98%85'); // Black star
      assert.strictEqual(cookieNameLenientPercentEncoder('🌟'), '%F0%9F%8C%9F'); // Glowing star emoji
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieNameLenientPercentEncoder('abc★def'), 'abc%E2%98%85def');
    });
  });
});
