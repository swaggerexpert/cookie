import { assert } from 'chai';

import { parseCookie, ListTranslator, CSTTranslator } from '../../../src/index.js';

describe('parseCookie', function () {
  context('backward compatibility', function () {
    context('given default translator', function () {
      specify('should expose deprecated ast as ListTranslator', function () {
        const parseResult = parseCookie('foo=bar');

        assert.instanceOf(parseResult.ast, ListTranslator);
      });

      specify('should translate ast to the same list of entries as ListTranslator', function () {
        const parseResult = parseCookie('foo=bar; baz="raz"');
        const { tree: list } = parseCookie('foo=bar; baz="raz"', {
          translator: new ListTranslator(),
        });
        const parts = [];

        parseResult.ast.translate(parts);

        assert.deepEqual(parts, list);
      });

      specify('should translate ast to XML', function () {
        const parseResult = parseCookie('foo=bar');
        const xml = parseResult.ast.toXml();

        assert.include(xml, '<node name="cookie-name" index="0" length="3">');
        assert.include(xml, '<node name="cookie-value" index="4" length="3">');
      });

      specify('should translate ast to empty list for invalid cookie string', function () {
        const parseResult = parseCookie('foo');
        const parts = [];

        parseResult.ast.translate(parts);

        assert.isFalse(parseResult.result.success);
        assert.lengthOf(parts, 0);
      });

      specify('should compute ast lazily only once', function () {
        const parseResult = parseCookie('foo=bar');

        assert.strictEqual(parseResult.ast, parseResult.ast);
      });

      specify('should allow reassigning ast', function () {
        const parseResult = parseCookie('foo=bar');
        const ast = new ListTranslator();

        parseResult.ast = ast;

        assert.strictEqual(parseResult.ast, ast);
      });
    });

    context('given lenient mode', function () {
      specify('should translate ast using normalized entry types', function () {
        const parseResult = parseCookie('foo = bar; fizz', { strict: false });
        const parts = [];

        parseResult.ast.translate(parts);

        assert.deepEqual(parts, [
          ['cookie-string', 'foo = bar; fizz'],
          ['cookie-pair', 'foo = bar'],
          ['cookie-name', 'foo'],
          ['cookie-value', 'bar'],
        ]);
      });
    });

    context('given explicit translator', function () {
      specify('should expose deprecated ast as ListTranslator', function () {
        const parseResult = parseCookie('foo=bar', { translator: new CSTTranslator() });

        assert.instanceOf(parseResult.ast, ListTranslator);
      });

      specify('should reuse ListTranslator as deprecated ast', function () {
        const translator = new ListTranslator();
        const parseResult = parseCookie('foo=bar', { translator });

        assert.strictEqual(parseResult.ast, translator);
      });
    });

    context('given no translator', function () {
      specify('should expose deprecated ast as ListTranslator', function () {
        const parseResult = parseCookie('foo=bar', { translator: null });

        assert.instanceOf(parseResult.ast, ListTranslator);
      });
    });
  });
});
