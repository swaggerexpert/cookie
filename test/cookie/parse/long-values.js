import { assert } from 'chai';

import {
  parseCookie,
  parseSetCookie,
  CSTTranslator,
  ListTranslator,
  EntriesTranslator,
  ObjectTranslator,
} from '../../../src/index.js';

describe('parseCookie', function () {
  context('given very long values', function () {
    const value = 'b'.repeat(200000);
    const cookieString = `a=${value}`;

    specify('should translate with every translator', function () {
      assert.strictEqual(parseCookie(cookieString).tree.pairs[0].value, value);
      assert.strictEqual(
        parseCookie(cookieString, { translator: new CSTTranslator() }).tree.text,
        cookieString,
      );
      assert.deepEqual(parseCookie(cookieString, { translator: new ListTranslator() }).tree[1], [
        'cookie-pair',
        cookieString,
      ]);
      assert.deepEqual(parseCookie(cookieString, { translator: new EntriesTranslator() }).tree, [
        ['a', value],
      ]);
      assert.strictEqual(
        parseCookie(cookieString, { translator: new ObjectTranslator() }).tree.a,
        value,
      );
    });

    specify('should translate in recovering mode', function () {
      [true, false].forEach((strict) => {
        const parseResult = parseCookie(`${cookieString}; b=x y`, {
          recover: true,
          strict,
          translator: new EntriesTranslator(),
        });

        assert.deepEqual(parseResult.tree, [['a', value]]);
        assert.deepEqual(parseResult.skipped, [
          { offset: cookieString.length + 2, length: 5, name: 'b' },
        ]);
      });
    });

    specify('should serve deprecated ast', function () {
      const parts = [];
      parseCookie(cookieString, { translator: null }).ast.translate(parts);

      assert.deepEqual(parts[3], ['cookie-value', value]);
    });

    specify('should parse Set-Cookie', function () {
      assert.strictEqual(parseSetCookie(cookieString).tree.value, value);
      assert.strictEqual(
        parseSetCookie(`${cookieString}; Path=/`, { strict: false }).tree.value,
        value,
      );
    });

    specify('should keep astral characters across conversion chunks', function () {
      const astral = `${'b'.repeat(8191)}\u{1F600}${'c'.repeat(8191)}\u{1F600}`.repeat(10);

      assert.strictEqual(parseSetCookie(`a=${astral}`, { strict: false }).tree.value, astral);
    });
  });
});
