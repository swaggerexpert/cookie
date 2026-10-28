import { assert } from 'chai';

import {
  parseCookie,
  parseSetCookie,
  serializeCookie,
  EntriesTranslator,
  cookieValueRotatingDecoder,
} from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('EntriesTranslator', function () {
      specify('should translate a cookie string to entries', function () {
        const { tree } = parseCookie('foo=bar; baz="raz"; empty=', {
          translator: new EntriesTranslator(),
        });

        assert.deepEqual(tree, [
          ['foo', 'bar'],
          ['baz', '"raz"'],
          ['empty', ''],
        ]);
      });

      specify('should retain duplicate cookie names in order of appearance', function () {
        const { tree } = parseCookie('foo=1; bar=2; foo=3', {
          translator: new EntriesTranslator(),
        });

        assert.deepEqual(tree, [
          ['foo', '1'],
          ['bar', '2'],
          ['foo', '3'],
        ]);
      });

      specify('should round trip with serializeCookie', function () {
        const cookieString = 'foo=bar; baz=raz; foo=boo';
        const { tree } = parseCookie(cookieString, { translator: new EntriesTranslator() });

        assert.strictEqual(serializeCookie(tree), cookieString);
      });

      specify('should translate a lenient cookie string to entries', function () {
        const { tree } = parseCookie(' foo = bar ; fizz; baz=raz', {
          strict: false,
          translator: new EntriesTranslator(),
        });

        assert.deepEqual(tree, [
          ['foo', 'bar'],
          ['baz', 'raz'],
        ]);
      });

      specify('should apply decoders', function () {
        const translator = new EntriesTranslator({
          decoders: { value: cookieValueRotatingDecoder },
        });

        assert.deepEqual(parseCookie('a=Ow; b=aGVsbG8', { translator }).tree, [
          ['a', ';'],
          ['b', 'hello'],
        ]);
      });

      specify('should not produce tree for invalid cookie string', function () {
        const parseResult = parseCookie('foo', { translator: new EntriesTranslator() });

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });

      specify('should translate a Set-Cookie string to entries', function () {
        const { tree } = parseSetCookie('id=a3fWa; Path=/; Secure', {
          translator: new EntriesTranslator(),
        });

        assert.deepEqual(tree, [['id', 'a3fWa']]);
      });
    });
  });
});
