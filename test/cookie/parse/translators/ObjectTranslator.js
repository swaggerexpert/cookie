import { assert } from 'chai';

import {
  parseCookie,
  parseSetCookie,
  ObjectTranslator,
  cookieValueRotatingDecoder,
  cookieNamePercentDecoder,
} from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('ObjectTranslator', function () {
      specify('should translate a cookie string to an object', function () {
        const { tree } = parseCookie('foo=bar; baz="raz"; empty=', {
          translator: new ObjectTranslator(),
        });

        assert.deepEqual(tree, { foo: 'bar', baz: '"raz"', empty: '' });
        assert.strictEqual(Object.getPrototypeOf(tree), Object.prototype);
      });

      specify('should use the first value of duplicate cookie names', function () {
        const { tree } = parseCookie('foo=1; bar=2; foo=3', { translator: new ObjectTranslator() });

        assert.deepEqual(tree, { foo: '1', bar: '2' });
      });

      specify('should not modify object prototype', function () {
        const { tree } = parseCookie('__proto__=a; constructor=b; hasOwnProperty=c', {
          translator: new ObjectTranslator(),
        });

        assert.deepEqual(Object.keys(tree), ['__proto__', 'constructor', 'hasOwnProperty']);
        assert.strictEqual(Object.getPrototypeOf(tree), Object.prototype);
        assert.isTrue(Object.prototype.hasOwnProperty.call(tree, '__proto__'));
        assert.strictEqual(tree.constructor, 'b');
        assert.isUndefined({}.a);
      });

      specify('should translate a lenient cookie string to an object', function () {
        const { tree } = parseCookie(' foo = bar ; fizz; baz=raz', {
          strict: false,
          translator: new ObjectTranslator(),
        });

        assert.deepEqual(tree, { foo: 'bar', baz: 'raz' });
      });

      specify('should apply decoders', function () {
        const translator = new ObjectTranslator({
          decoders: { name: cookieNamePercentDecoder, value: cookieValueRotatingDecoder },
        });
        const { tree } = parseCookie('a%25=Ow; b=aGVsbG8', { translator });

        assert.deepEqual(tree, { 'a%': ';', b: 'hello' });
      });

      specify('should not produce tree for invalid cookie string', function () {
        const parseResult = parseCookie('foo', { translator: new ObjectTranslator() });

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });

      specify('should translate a Set-Cookie string to an object', function () {
        const { tree } = parseSetCookie('id=a3fWa; Path=/; Secure', {
          translator: new ObjectTranslator(),
        });

        assert.deepEqual(tree, { id: 'a3fWa' });
      });
    });
  });
});
