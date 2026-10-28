import { assert } from 'chai';

import { parseCookie, CSTTranslator } from '../../../../src/index.js';

describe('parseCookie', function () {
  context('translators', function () {
    context('CSTTranslator', function () {
      specify('should translate a cookie string to a CST', function () {
        const parseResult = parseCookie('foo=bar; baz=', { translator: new CSTTranslator() });

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parseResult.tree, {
          type: 'cookie-string',
          text: 'foo=bar; baz=',
          start: 0,
          length: 13,
          children: [
            {
              type: 'cookie-pair',
              text: 'foo=bar',
              start: 0,
              length: 7,
              children: [
                { type: 'cookie-name', text: 'foo', start: 0, length: 3, children: [] },
                { type: 'cookie-value', text: 'bar', start: 4, length: 3, children: [] },
              ],
            },
            {
              type: 'cookie-pair',
              text: 'baz=',
              start: 9,
              length: 4,
              children: [
                { type: 'cookie-name', text: 'baz', start: 9, length: 3, children: [] },
                { type: 'cookie-value', text: '', start: 13, length: 0, children: [] },
              ],
            },
          ],
        });
      });

      specify('should translate a lenient cookie string using normalized node types', function () {
        const parseResult = parseCookie('foo = bar', {
          strict: false,
          translator: new CSTTranslator(),
        });

        assert.deepEqual(parseResult.tree, {
          type: 'cookie-string',
          text: 'foo = bar',
          start: 0,
          length: 9,
          children: [
            {
              type: 'cookie-pair',
              text: 'foo = bar',
              start: 0,
              length: 9,
              children: [
                { type: 'cookie-name', text: 'foo', start: 0, length: 3, children: [] },
                { type: 'cookie-value', text: 'bar', start: 6, length: 3, children: [] },
              ],
            },
          ],
        });
      });

      specify('should not produce tree for invalid cookie string', function () {
        const parseResult = parseCookie('foo', { translator: new CSTTranslator() });

        assert.isFalse(parseResult.result.success);
        assert.isUndefined(parseResult.tree);
      });
    });
  });
});
