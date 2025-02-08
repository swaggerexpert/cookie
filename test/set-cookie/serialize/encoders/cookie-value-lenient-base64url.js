import { assert } from 'chai';
import { base64urlEncoder, cookieValueLenientBase64urlEncoder } from '../../../../src/index.js';

describe('cookieValueLenientBase64urlEncoder', function () {
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

      assert.strictEqual(cookieValueLenientBase64urlEncoder(valid), valid);
    });

    specify('should encode non-lenient-cookie-octets', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"'), '"'); // DQUOTE
      assert.strictEqual(cookieValueLenientBase64urlEncoder(';'), 'Ow'); // semicolon
      assert.strictEqual(cookieValueLenientBase64urlEncoder(','), 'LA'); // comma (for unquoted)
    });
  });

  context('Quote handling with lenient-quoted-char', () => {
    specify('should preserve valid quoted characters', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('" !#$%&\'()*+"'), '" !#$%&\'()*+"');
      assert.strictEqual(
        cookieValueLenientBase64urlEncoder('"-./0123456789:"'),
        '"-./0123456789:"',
      );
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"<=>?@"'), '"<=>?@"');
      assert.strictEqual(
        cookieValueLenientBase64urlEncoder('"ABCDEFGHIJKLMNOPQRSTUVWXYZ"'),
        '"ABCDEFGHIJKLMNOPQRSTUVWXYZ"',
      );
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"[\\]^_`"'), '"[\\]^_`"');
      assert.strictEqual(
        cookieValueLenientBase64urlEncoder('"abcdefghijklmnopqrstuvwxyz"'),
        '"abcdefghijklmnopqrstuvwxyz"',
      );
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"{|}~"'), '"{|}~"');
    });

    specify('should handle spaces in quoted strings', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('" abc "'), '" abc "');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"   "'), '"   "');
    });

    specify('should handle special characters in quoted strings', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"a,b"'), '"a,b"'); // comma allowed in quotes
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"a;b"'), '"a;b"'); // semicolon always encoded
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"a\\b"'), '"a\\b"'); // backslash allowed in quotes
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"""'), '"""');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"π"'), '"z4A"');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"★"'), '"4piF"');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"🌟"'), '"8J-Mnw"');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('abc★def'), 'YWJj4piFZGVm');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"abc★def"'), '"YWJj4piFZGVm"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder(123), '123');
      assert.strictEqual(cookieValueLenientBase64urlEncoder(null), 'null');
      assert.strictEqual(cookieValueLenientBase64urlEncoder(undefined), 'undefined');
      assert.strictEqual(cookieValueLenientBase64urlEncoder([1, 2, 3]), 'MSwyLDM');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueLenientBase64urlEncoder(char),
          base64urlEncoder(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder(''), '');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('""'), '""');
    });

    specify('should handle unmatched quotes', () => {
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"abc'), '"abc');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('abc"'), 'abc"');
      assert.strictEqual(cookieValueLenientBase64urlEncoder('"'), '"');
    });
  });
});
