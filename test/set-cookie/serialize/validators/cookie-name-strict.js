import { assert } from 'chai';

import { cookieNameStrictValidator } from '../../../../src/index.js';

describe('cookieNameStrictValidator', function () {
  context('Valid cookie names', function () {
    specify('should not throw for valid single character names', function () {
      const validSingleChars = [
        '!',
        '#',
        '$',
        '%',
        '&',
        "'",
        '*',
        '+',
        '-',
        '.',
        '^',
        '_',
        '`',
        '|',
        '~',
        '0',
        '9',
        'A',
        'Z',
        'a',
        'z',
      ];

      for (const char of validSingleChars) {
        assert.doesNotThrow(
          () => cookieNameStrictValidator(char),
          `Expected '${char}' to be valid and not throw an error`,
        );
      }
    });

    specify('should not throw for valid multi-character names', function () {
      const validNames = [
        'cookieName',
        'COOKIE_NAME',
        'name123',
        "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~",
        'A1_cookie-name',
      ];

      for (const name of validNames) {
        assert.doesNotThrow(
          () => cookieNameStrictValidator(name),
          `Expected '${name}' to be valid and not throw an error`,
        );
      }
    });
  });

  context('Invalid cookie names', function () {
    specify('should throw for names containing control characters', function () {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.throws(
          () => cookieNameStrictValidator(char),
          /^Invalid cookie name:/,
          `Control character ${i} (${JSON.stringify(char)}) should throw an error starting with "Invalid cookie name:"`,
        );
      }
    });

    specify('should throw for DEL character', function () {
      assert.throws(
        () => cookieNameStrictValidator('\x7F'),
        /^Invalid cookie name:/,
        `DEL character should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for names containing spaces', function () {
      const invalidName = 'cookie name';
      assert.throws(
        () => cookieNameStrictValidator(invalidName),
        /^Invalid cookie name:/,
        `"${invalidName}" should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for names containing tabs', function () {
      const invalidName = 'cookie\tname';
      assert.throws(
        () => cookieNameStrictValidator(invalidName),
        /^Invalid cookie name:/,
        `"${invalidName}" should throw an error starting with "Invalid cookie name:"`,
      );
    });

    specify('should throw for names containing delimiters', function () {
      const invalidNames = [
        'name=value',
        '(cookie)',
        '<cookie>',
        '[cookie]',
        '{cookie}',
        ';cookie',
      ];

      for (const name of invalidNames) {
        assert.throws(
          () => cookieNameStrictValidator(name),
          /^Invalid cookie name:/,
          `${name} should throw an error starting with "Invalid cookie name:"`,
        );
      }
    });

    specify('should throw for names containing non-ASCII characters', function () {
      const invalidNames = ['π', '★', '🌟'];

      for (const name of invalidNames) {
        assert.throws(
          () => cookieNameStrictValidator(name),
          /^Invalid cookie name:/,
          `${name} should throw an error starting with "Invalid cookie name:"`,
        );
      }
    });

    specify('should throw for empty names', function () {
      const emptyName = '';
      assert.throws(
        () => cookieNameStrictValidator(emptyName),
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
          () => cookieNameStrictValidator(char),
          `Expected '${char}' to be valid and not throw an error`,
        );
      }
    });

    specify('should not throw for valid multi-character inputs', function () {
      const validNames = ['cookieName123', 'VALID_cookie-name', "!#$%&'*+"];

      for (const name of validNames) {
        assert.doesNotThrow(
          () => cookieNameStrictValidator(name),
          `Expected '${name}' to be valid and not throw an error`,
        );
      }
    });
  });
});
