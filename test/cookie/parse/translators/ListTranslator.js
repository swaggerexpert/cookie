import { assert } from 'chai';

import { parseCookie, ListTranslator } from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('ListTranslator', function () {
      specify('should translate a cookie string to a list of entries', function () {
        const { tree } = parseCookie('foo=bar; baz=raz', { translator: new ListTranslator() });

        assert.deepEqual(tree, [
          ['cookie-string', 'foo=bar; baz=raz'],
          ['cookie-pair', 'foo=bar'],
          ['cookie-name', 'foo'],
          ['cookie-value', 'bar'],
          ['cookie-pair', 'baz=raz'],
          ['cookie-name', 'baz'],
          ['cookie-value', 'raz'],
        ]);
      });
    });
  });
});
