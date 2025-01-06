import { assert } from 'chai';

import { cookieValueLenientValidator } from '../../../../src/index.js';

describe('cookieValueLenientValidator', function () {
  context('Valid lenient cookie values', function () {
    specify(
      'should not throw for unquoted values containing valid lenient-cookie-octet characters',
      function () {
        const validValues = [
          "!#$%&'()*+-./0123456789:<>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~",
          '',
          'lenientValue',
          '12345',
        ];

        for (const value of validValues) {
          assert.doesNotThrow(
            () => cookieValueLenientValidator(value),
            `Expected '${value}' to be valid and not throw an error`,
          );
        }
      },
    );

    specify(
      'should not throw for quoted values containing valid lenient-quoted-char characters',
      function () {
        const validQuotedValues = [
          '" !#$%&\'()*+,-./0123456789:<>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"',
          '""',
          '"lenientQuotedValue123"',
          '"12345"',
          '"value\\"', // Backslash
          '"value;"', // Semicolon
        ];

        for (const value of validQuotedValues) {
          assert.doesNotThrow(
            () => cookieValueLenientValidator(value),
            `Expected '${value}' to be valid and not throw an error`,
          );
        }
      },
    );

    specify('should not throw for combined quoted and unquoted values', function () {
      const combinedValues = ['"quotedValue"!#$%&\'()*+', '"anotherValue"12345', 'value"'];

      for (const value of combinedValues) {
        assert.doesNotThrow(
          () => cookieValueLenientValidator(value),
          `Expected '${value}' to be valid and not throw an error`,
        );
      }
    });

    specify(
      'should not throw for unquoted values containing valid lenient-cookie-octet characters, including DQUOTE',
      function () {
        const value = 'value"';
        assert.doesNotThrow(
          () => cookieValueLenientValidator(value),
          `Expected '${value}' to be valid and not throw an error`,
        );
      },
    );

    specify('should not throw for quoted values missing the closing quote', function () {
      const value = '"value';
      assert.doesNotThrow(
        () => cookieValueLenientValidator(value),
        `Expected '${value}' to be valid and not throw an error`,
      );
    });
  });

  context('Invalid lenient cookie values', function () {
    specify('should throw for unquoted values containing invalid characters', function () {
      const invalidValues = [
        'value ', // Space
        'value;', // Semicolon
        'value\t', // Tab
        'value\n', // Newline
      ];

      for (const value of invalidValues) {
        assert.throws(
          () => cookieValueLenientValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });

    specify('should throw for quoted values containing invalid characters', function () {
      const invalidQuotedValues = [
        '"value\t"', // Tab character
        '"value\n"', // Newline character
        '"value""followed by unquoted"',
      ];

      for (const value of invalidQuotedValues) {
        assert.throws(
          () => cookieValueLenientValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });
  });

  context('Edge cases', function () {
    specify('should not throw for empty strings', function () {
      assert.doesNotThrow(
        () => cookieValueLenientValidator(''),
        `Expected '' to be valid and not throw an error`,
      );
    });

    specify('should throw for null or undefined values', function () {
      const invalidValues = [null, undefined];

      for (const value of invalidValues) {
        assert.throws(
          () => cookieValueLenientValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });
  });
});
