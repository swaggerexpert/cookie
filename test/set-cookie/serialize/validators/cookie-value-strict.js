import { assert } from 'chai';

import { cookieValueStrictValidator } from '../../../../src/index.js';

describe('cookieValueStrictValidator', function () {
  context('Valid cookie values', function () {
    specify(
      'should not throw for unquoted values containing valid cookie-octet characters',
      function () {
        const validValues = [
          "!#$%&'()*+-./0123456789:<>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~",
          '',
          'simpleValue',
          '12345',
        ];

        for (const value of validValues) {
          try {
            cookieValueStrictValidator(value);
          } catch (error) {
            assert.fail(`Validation failed for value '${value}': ${error.message}`);
          }
        }
      },
    );

    specify(
      'should not throw for quoted values containing valid cookie-octet characters',
      function () {
        const validQuotedValues = [
          '""',
          '"quotedValue123"',
          '"!#$%&\'()*+-./0123456789:<>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~"',
          '""',
          '"12345"',
        ];

        for (const value of validQuotedValues) {
          try {
            cookieValueStrictValidator(value);
          } catch (error) {
            assert.fail(`Validation failed for value '${value}': ${error.message}`);
          }
        }
      },
    );

    specify('should throw for quoted values followed by unquoted characters', function () {
      const combinedValues = ['"quotedValue"!#$%&\'()*+', '"anotherValue"12345'];

      for (const value of combinedValues) {
        assert.throws(
          () => cookieValueStrictValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });
  });

  context('Invalid cookie values', function () {
    specify('should throw for unquoted values containing invalid characters', function () {
      const invalidValues = [
        'value ', // Space
        'value;', // Semicolon
        'value\t', // Tab
        'value\n', // Newline
        'value"', // DQUOTE in unquoted value
        'value\\', // Backslash in unquoted value
      ];

      for (const value of invalidValues) {
        assert.throws(
          () => cookieValueStrictValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });

    specify('should throw for quoted values containing invalid characters', function () {
      const invalidQuotedValues = [
        '"value\t"', // Tab character
        '"value\n"', // Newline character
        '"value\\"', // Backslash
        '"value;"', // Semicolon
        '"value""followed by unquoted"', // Misaligned quotes
      ];

      for (const value of invalidQuotedValues) {
        assert.throws(
          () => cookieValueStrictValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });

    specify('should throw for quoted values missing the closing quote', function () {
      const invalidValues = ['"value'];

      for (const value of invalidValues) {
        assert.throws(
          () => cookieValueStrictValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });

    specify('should throw for quoted values missing the opening quote', function () {
      const invalidValues = ['value"'];

      for (const value of invalidValues) {
        assert.throws(
          () => cookieValueStrictValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });
  });

  context('Edge cases', function () {
    specify('should not throw for empty strings', function () {
      try {
        cookieValueStrictValidator('');
      } catch (error) {
        assert.fail(`Validation failed for empty string: ${error.message}`);
      }
    });

    specify('should throw for null or undefined values', function () {
      const invalidValues = [null, undefined];

      for (const value of invalidValues) {
        assert.throws(
          () => cookieValueStrictValidator(value),
          /^Invalid cookie value:/,
          `${value} should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });

    specify('should throw for control characters in unquoted or quoted values', function () {
      for (let i = 0; i < 32; i++) {
        const char = String.fromCharCode(i);
        assert.throws(
          () => cookieValueStrictValidator(char),
          /^Invalid cookie value:/,
          `Control character ${i} (${JSON.stringify(char)}) should throw an error starting with "Invalid cookie value:"`,
        );
      }
    });
  });
});
