import { assert } from 'chai';
import { base64Encoder, cookieValueLenientBase64Encoder } from '../../../../src/index.js';

describe('cookieValueLenientBase64Encoder', function () {
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

      assert.strictEqual(cookieValueLenientBase64Encoder(valid), valid);
    });

    specify('should encode non-lenient-cookie-octets', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('"'), '"'); // DQUOTE
      assert.strictEqual(cookieValueLenientBase64Encoder(';'), 'Ow=='); // semicolon
      assert.strictEqual(cookieValueLenientBase64Encoder(','), 'LA=='); // comma (for unquoted)
    });
  });

  context('Quote handling with lenient-quoted-char', () => {
    specify('should preserve valid quoted characters', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('" !#$%&\'()*+"'), '" !#$%&\'()*+"');
      assert.strictEqual(cookieValueLenientBase64Encoder('"-./0123456789:"'), '"-./0123456789:"');
      assert.strictEqual(cookieValueLenientBase64Encoder('"<=>?@"'), '"<=>?@"');
      assert.strictEqual(
        cookieValueLenientBase64Encoder('"ABCDEFGHIJKLMNOPQRSTUVWXYZ"'),
        '"ABCDEFGHIJKLMNOPQRSTUVWXYZ"',
      );
      assert.strictEqual(cookieValueLenientBase64Encoder('"[\\]^_`"'), '"[\\]^_`"');
      assert.strictEqual(
        cookieValueLenientBase64Encoder('"abcdefghijklmnopqrstuvwxyz"'),
        '"abcdefghijklmnopqrstuvwxyz"',
      );
      assert.strictEqual(cookieValueLenientBase64Encoder('"{|}~"'), '"{|}~"');
    });

    specify('should handle spaces in quoted strings', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('" abc "'), '" abc "');
      assert.strictEqual(cookieValueLenientBase64Encoder('"   "'), '"   "');
    });

    specify('should handle special characters in quoted strings', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('"a,b"'), '"a,b"'); // comma allowed in quotes
      assert.strictEqual(cookieValueLenientBase64Encoder('"a;b"'), '"a;b"'); // semicolon always encoded
      assert.strictEqual(cookieValueLenientBase64Encoder('"a\\b"'), '"a\\b"'); // backslash allowed in quotes
      assert.strictEqual(cookieValueLenientBase64Encoder('"""'), '"""');
    });
  });

  context('Unicode handling', () => {
    specify('should encode Unicode characters', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('"π"'), '"z4A="');
      assert.strictEqual(cookieValueLenientBase64Encoder('"★"'), '"4piF"');
      assert.strictEqual(cookieValueLenientBase64Encoder('"🌟"'), '"8J+Mnw=="');
    });

    specify('should handle mixed ASCII and Unicode', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('abc★def'), 'YWJj4piFZGVm');
      assert.strictEqual(cookieValueLenientBase64Encoder('"abc★def"'), '"YWJj4piFZGVm"');
    });
  });

  context('Edge cases', () => {
    specify('should handle non-string inputs', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder(123), '123');
      assert.strictEqual(cookieValueLenientBase64Encoder(null), 'null');
      assert.strictEqual(cookieValueLenientBase64Encoder(undefined), 'undefined');
      assert.strictEqual(cookieValueLenientBase64Encoder([1, 2, 3]), 'MSwyLDM=');
    });

    specify('should handle control characters', () => {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.strictEqual(
          cookieValueLenientBase64Encoder(char),
          base64Encoder(char),
          `Control character ${i} should be encoded`,
        );
      }
    });
  });

  context('Boundary cases', () => {
    specify('should handle empty strings', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder(''), '');
      assert.strictEqual(cookieValueLenientBase64Encoder('""'), '""');
    });

    specify('should handle unmatched quotes', () => {
      assert.strictEqual(cookieValueLenientBase64Encoder('"abc'), '"abc');
      assert.strictEqual(cookieValueLenientBase64Encoder('abc"'), 'abc"');
      assert.strictEqual(cookieValueLenientBase64Encoder('"'), '"');
    });
  });
});
