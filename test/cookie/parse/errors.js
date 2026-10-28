import { assert } from 'chai';

import { parseCookie, ListTranslator, CookieError, CookieParseError } from '../../../src/index.js';

describe('parseCookie', function () {
  context('errors', function () {
    specify('should throw TypeError on non-string input', function () {
      assert.throws(() => parseCookie(1), TypeError, 'Cookie string must be a string');
    });

    specify('should wrap unexpected errors in CookieParseError', function () {
      class FailingTranslator extends ListTranslator {
        getTree() {
          throw new Error('boom');
        }
      }
      const translator = new FailingTranslator();

      try {
        parseCookie('foo=bar', { translator });
        assert.fail('should have thrown');
      } catch (error) {
        assert.instanceOf(error, CookieParseError);
        assert.instanceOf(error, CookieError);
        assert.strictEqual(error.cookieString, 'foo=bar');
        assert.strictEqual(error.cause.message, 'boom');
      }
    });
  });
});
