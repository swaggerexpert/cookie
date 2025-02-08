import { assert } from 'chai';

import { base64Encoder, cookieValueStrictBase64Encoder } from '../../../../src/index.js';

describe('cookieValueStrictBase64Encoder', function () {
  context('RFC 6265 compliance', () => {
    specify('should preserve valid cookie-octets', () => {
      const valid =
        "!#$%&'()*+-./0123456789:<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";

      assert.strictEqual(cookieValueStrictBase64Encoder(valid), valid);
    });

    specify('should encode non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder(' '), 'IA==');
      assert.strictEqual(cookieValueStrictBase64Encoder('"'), 'Ig==');
      assert.strictEqual(cookieValueStrictBase64Encoder('\\'), 'XA==');
      assert.strictEqual(cookieValueStrictBase64Encoder(','), 'LA==');
      assert.strictEqual(cookieValueStrictBase64Encoder(';'), 'Ow==');
    });

    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder(''), '');
      assert.strictEqual(cookieValueStrictBase64Encoder('""'), '""');
    });
  });

  context('Quote handling', () => {
    specify('should preserve properly quoted strings', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('"abc"'), '"abc"');
      assert.strictEqual(cookieValueStrictBase64Encoder('"!#$"'), '"!#$"');
    });

    specify('should handle quoted strings containing non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('"a b c"'), '"YSBiIGM="');
      assert.strictEqual(cookieValueStrictBase64Encoder('"a,b;c"'), '"YSxiO2M="');
    });

    specify('should handle strings with unmatched quotes', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('abc"'), 'YWJjIg==');
      assert.strictEqual(cookieValueStrictBase64Encoder('"abc'), 'ImFiYw==');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('π'), 'z4A=');
      assert.strictEqual(cookieValueStrictBase64Encoder('★'), '4piF');
      assert.strictEqual(cookieValueStrictBase64Encoder('🌟'), '8J+Mnw==');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('abc★def'), 'YWJj4piFZGVm');
      assert.strictEqual(cookieValueStrictBase64Encoder('"abc★def"'), '"YWJj4piFZGVm"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder(123), '123');
      assert.strictEqual(cookieValueStrictBase64Encoder(0), '0');
      assert.strictEqual(cookieValueStrictBase64Encoder(null), 'null');
      assert.strictEqual(cookieValueStrictBase64Encoder(undefined), 'undefined');
      assert.strictEqual(cookieValueStrictBase64Encoder(true), 'true');
      assert.strictEqual(cookieValueStrictBase64Encoder(false), 'false');
      assert.strictEqual(cookieValueStrictBase64Encoder({}), 'W29iamVjdCBPYmplY3Rd');
      assert.strictEqual(cookieValueStrictBase64Encoder([1, 2, 3]), 'MSwyLDM=');
    });

    specify('should handle strings with multiple spaces and special characters', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('a  b'), 'YSAgYg==');
      assert.strictEqual(cookieValueStrictBase64Encoder('a\tb'), 'YQli');
      assert.strictEqual(cookieValueStrictBase64Encoder('a\nb'), 'YQpi');
      assert.strictEqual(cookieValueStrictBase64Encoder('a\rb'), 'YQ1i');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueStrictBase64Encoder(char),
          base64Encoder(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle strings with quotes and spaces', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder(' "abc" '), 'ICJhYmMiIA==');
      assert.strictEqual(cookieValueStrictBase64Encoder('" abc "'), '"IGFiYyA="');
      assert.strictEqual(cookieValueStrictBase64Encoder('"""'), '"Ig=="');
    });

    specify('should handle minimal quoted strings', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder('""'), '""');
      assert.strictEqual(cookieValueStrictBase64Encoder('"a"'), '"a"');
    });

    specify('should handle repeated special characters', () => {
      assert.strictEqual(cookieValueStrictBase64Encoder(',,,,'), 'LCwsLA==');
      assert.strictEqual(cookieValueStrictBase64Encoder(';;;;'), 'Ozs7Ow==');
      assert.strictEqual(cookieValueStrictBase64Encoder('    '), 'ICAgIA==');
    });
  });
});
