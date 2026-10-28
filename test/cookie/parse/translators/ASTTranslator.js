import { assert } from 'chai';

import { parseCookie, ASTTranslator } from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('ASTTranslator', function () {
      specify('should be the default translator', function () {
        const { tree } = parseCookie('foo=bar');

        assert.deepEqual(tree, {
          type: 'CookieString',
          pairs: [{ type: 'CookiePair', name: 'foo', value: 'bar' }],
        });
      });

      specify('should translate a cookie string to an AST', function () {
        const { tree } = parseCookie('foo=bar; baz="raz"; empty=', {
          translator: new ASTTranslator(),
        });

        assert.deepEqual(tree, {
          type: 'CookieString',
          pairs: [
            { type: 'CookiePair', name: 'foo', value: 'bar' },
            { type: 'CookiePair', name: 'baz', value: '"raz"' },
            { type: 'CookiePair', name: 'empty', value: '' },
          ],
        });
      });

      specify('should skip invalid entries in lenient mode', function () {
        const { tree } = parseCookie('fizz; foo = bar ;buzz', { strict: false });

        assert.deepEqual(tree, {
          type: 'CookieString',
          pairs: [{ type: 'CookiePair', name: 'foo', value: 'bar' }],
        });
      });

      specify('should not produce tree for invalid cookie string', function () {
        const parseResult = parseCookie('foo');

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });
  });
});
