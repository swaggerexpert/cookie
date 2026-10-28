import { assert } from 'chai';

import {
  parseCookie,
  ASTTranslator,
  CookieParseError,
  cookieNamePercentDecoder,
  cookieValueBase64urlDecoder,
  cookieValueRotatingDecoder,
} from '../../../src/index.js';

describe('parseCookie', function () {
  context('decoders', function () {
    specify('should not decode by default', function () {
      const { tree } = parseCookie('a=Ow; b=hello%20world');

      assert.deepEqual(tree.pairs, [
        { type: 'CookiePair', name: 'a', value: 'Ow' },
        { type: 'CookiePair', name: 'b', value: 'hello%20world' },
      ]);
    });

    specify('should decode names and values', function () {
      const { tree } = parseCookie('a%25=Ow', {
        decoders: { name: cookieNamePercentDecoder, value: cookieValueBase64urlDecoder },
      });

      assert.deepEqual(tree.pairs, [{ type: 'CookiePair', name: 'a%', value: ';' }]);
    });

    specify('should decode values using rotating decoder', function () {
      const { tree } = parseCookie('a=Ow; b=en; c=hello%20world', {
        decoders: { value: cookieValueRotatingDecoder },
      });

      assert.deepEqual(
        tree.pairs.map(({ value }) => value),
        [';', 'en', 'hello world'],
      );
    });

    specify('should support decoders via ASTTranslator', function () {
      const translator = new ASTTranslator({ decoders: { value: cookieValueBase64urlDecoder } });
      const { tree } = parseCookie('a=Ow', { translator });

      assert.strictEqual(tree.pairs[0].value, ';');
    });

    specify('should keep deprecated ast undecoded', function () {
      const parts = [];
      parseCookie('a=Ow', { decoders: { value: cookieValueBase64urlDecoder } }).ast.translate(
        parts,
      );

      assert.deepEqual(parts[3], ['cookie-value', 'Ow']);
    });

    specify('should throw CookieParseError when decoder fails', function () {
      assert.throws(
        () => parseCookie('a=bar', { decoders: { value: cookieValueBase64urlDecoder } }),
        CookieParseError,
      );
    });
  });
});
