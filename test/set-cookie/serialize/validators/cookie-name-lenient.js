import { assert } from 'chai';

import { cookieNameLenientValidator } from '../../../../src/index.js';

describe('cookieNameLenientValidator', function () {
  context('Valid cookie names', function () {
    specify('should not throw for valid single character names', function () {
      const validSingleChars = [
        '!',
        '"',
        '#',
        '$',
        '%',
        '&',
        "'",
        '(',
        ')',
        '*',
        '+',
        ',',
        '-',
        '.',
        '/',
        '0',
        '1',
        '9',
        ':',
        '<',
        '>',
        '?',
        '@',
        'A',
        'Z',
        '[',
        ']',
        '^',
        '_',
        '`',
        'a',
        'z',
        '{',
        '|',
        '}',
        '~',
      ];

      for (const char of validSingleChars) {
        assert.doesNotThrow(
          () => cookieNameLenientValidator(char),
          `Expected '${char}' to be valid and not throw an error`,
        );
      }
    });

    specify('should not throw for valid multi-character names', function () {
      const validNames = [
        'cookieName',
        'COOKIE_NAME',
        'name123',
        "!#$%&'()*+-./0123456789:<>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
      ];

      for (const name of validNames) {
        assert.doesNotThrow(
          () => cookieNameLenientValidator(name),
          `Expected '${name}' to be valid and not throw an error`,
        );
      }
    });
  });

  context('Invalid cookie names', function () {
    specify('should throw for names containing "="', function () {
      const invalidName = 'name=';
      assert.throws(
        () => cookieNameLenientValidator(invalidName),
        /^Invalid cookie name:/,
        `"${invalidName}" should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for names containing control characters', function () {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.throws(
          () => cookieNameLenientValidator(char),
          /^Invalid cookie name:/,
          `Control character ${i} (${JSON.stringify(char)}) should throw an error starting with "Invalid cookie name:"`,
        );
      }
    });

    specify('should throw for DEL character', function () {
      const invalidChar = '\x7F';
      assert.throws(
        () => cookieNameLenientValidator(invalidChar),
        /^Invalid cookie name:/,
        `DEL character should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for names containing spaces', function () {
      const invalidName = 'cookie name';
      assert.throws(
        () => cookieNameLenientValidator(invalidName),
        /^Invalid cookie name:/,
        `"${invalidName}" should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for names containing tabs', function () {
      const invalidName = 'cookie\tname';
      assert.throws(
        () => cookieNameLenientValidator(invalidName),
        /^Invalid cookie name:/,
        `"${invalidName}" should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for non-printable ASCII characters', function () {
      for (let i = 128; i < 160; i++) {
        const char = String.fromCharCode(i);
        assert.throws(
          () => cookieNameLenientValidator(char),
          /^Invalid cookie name:/,
          `Non-printable character ${i} (${JSON.stringify(char)}) should throw an error starting with "Invalid cookie name:"`,
        );
      }
    });

    specify('should throw for names containing non-ASCII characters', function () {
      const invalidNames = ['π', '★', '🌟'];

      for (const name of invalidNames) {
        assert.throws(
          () => cookieNameLenientValidator(name),
          /^Invalid cookie name:/,
          `${name} should throw an error starting with "Invalid cookie name:"`,
        );
      }
    });

    specify('should throw for empty names', function () {
      const emptyName = '';
      assert.throws(
        () => cookieNameLenientValidator(emptyName),
        /^Invalid cookie name:/,
        `Empty name should throw an error starting with "Invalid cookie name:"`,
      );
    });
  });

  context('Valid inputs do not throw', function () {
    specify('should not throw for valid single characters', function () {
      const validChars = ['!', '#', '*', 'z', 'A', '~'];

      for (const char of validChars) {
        assert.doesNotThrow(
          () => cookieNameLenientValidator(char),
          `Expected '${char}' to be valid and not throw an error`,
        );
      }
    });

    specify('should not throw for valid multi-character inputs', function () {
      const validNames = ['cookieName123', 'VALID_cookie-name', "!#$%&'*+"];

      for (const name of validNames) {
        assert.doesNotThrow(
          () => cookieNameLenientValidator(name),
          `Expected '${name}' to be valid and not throw an error`,
        );
      }
    });
  });
});
