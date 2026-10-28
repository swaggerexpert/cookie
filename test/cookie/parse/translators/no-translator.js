import { assert } from 'chai';

import { parseCookie } from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('given no translator', function () {
      specify('should only validate', function () {
        const parseResult = parseCookie('foo=bar', { translator: null });

        assert.isTrue(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });
  });
});
