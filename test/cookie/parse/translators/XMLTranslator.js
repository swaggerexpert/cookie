import { assert } from 'chai';

import { parseCookie, XMLTranslator } from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('XMLTranslator', function () {
      specify('should translate a cookie string to XML', function () {
        const { tree } = parseCookie('foo=bar', { translator: new XMLTranslator() });

        assert.isString(tree);
        assert.include(tree, '<node name="cookie-string" index="0" length="7">');
        assert.include(tree, '<node name="cookie-pair" index="0" length="7">');
      });
    });
  });
});
