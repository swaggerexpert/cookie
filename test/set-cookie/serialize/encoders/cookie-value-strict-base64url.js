import { assert } from 'chai';

import { base64urlEncoder, cookieValueStrictBase64urlEncoder } from '../../../../src/index.js';

describe('cookieValueStrictBase64urlEncoder', function () {
  context('RFC 6265 compliance', () => {
    specify('should preserve valid cookie-octets', () => {
      const valid =
        "!#$%&'()*+-./0123456789:<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";

      assert.strictEqual(cookieValueStrictBase64urlEncoder(valid), valid);
    });

    specify('should encode non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder(' '), 'IA');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"'), 'Ig');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('\\'), 'XA');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(','), 'LA');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(';'), 'Ow');
    });

    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder(''), '');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('""'), '""');
    });
  });

  context('Quote handling', () => {
    specify('should preserve properly quoted strings', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"abc"'), '"abc"');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"!#$"'), '"!#$"');
    });

    specify('should handle quoted strings containing non-cookie-octets', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"a b c"'), '"YSBiIGM"');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"a,b;c"'), '"YSxiO2M"');
    });

    specify('should handle strings with unmatched quotes', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('abc"'), 'YWJjIg');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"abc'), 'ImFiYw');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('π'), 'z4A');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('★'), '4piF');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('🌟'), '8J-Mnw');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('abc★def'), 'YWJj4piFZGVm');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"abc★def"'), '"YWJj4piFZGVm"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder(123), '123');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(0), '0');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(null), 'null');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(undefined), 'undefined');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(true), 'true');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(false), 'false');
      assert.strictEqual(cookieValueStrictBase64urlEncoder({}), 'W29iamVjdCBPYmplY3Rd');
      assert.strictEqual(cookieValueStrictBase64urlEncoder([1, 2, 3]), 'MSwyLDM');
    });

    specify('should handle strings with multiple spaces and special characters', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('a  b'), 'YSAgYg');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('a\tb'), 'YQli');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('a\nb'), 'YQpi');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('a\rb'), 'YQ1i');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueStrictBase64urlEncoder(char),
          base64urlEncoder(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle strings with quotes and spaces', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder(' "abc" '), 'ICJhYmMiIA');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('" abc "'), '"IGFiYyA"');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"""'), '"Ig"');
    });

    specify('should handle minimal quoted strings', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder('""'), '""');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('"a"'), '"a"');
    });

    specify('should handle repeated special characters', () => {
      assert.strictEqual(cookieValueStrictBase64urlEncoder(',,,,'), 'LCwsLA');
      assert.strictEqual(cookieValueStrictBase64urlEncoder(';;;;'), 'Ozs7Ow');
      assert.strictEqual(cookieValueStrictBase64urlEncoder('    '), 'ICAgIA');
    });
  });
});
