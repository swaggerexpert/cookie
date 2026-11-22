import { assert } from 'chai';

import {
  parseCookie,
  parseSetCookie,
  ASTTranslator,
  ObjectTranslator,
  cookieValuePercentDecoder,
  cookieValueBase64Decoder,
  EntriesTranslator,
  CSTTranslator,
  ListTranslator,
  XMLTranslator,
} from '../../../src/index.js';

const parseEntries = (cookieString, options = {}) =>
  parseCookie(cookieString, { recover: true, translator: new EntriesTranslator(), ...options });

const strictModes = [true, false];

describe('parseCookie', function () {
  context('given recover option', function () {
    const acceptance = [
      {
        cookieString: 'sid=AAA; other=x; sid=BBB',
        strict: strictModes,
        pairs: [
          ['sid', 'AAA'],
          ['other', 'x'],
          ['sid', 'BBB'],
        ],
        skipped: [],
      },
      {
        cookieString: 'a=1; bad=x y; sid=AAA',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['sid', 'AAA'],
        ],
        skipped: [{ offset: 5, length: 7, name: 'bad' }],
      },
      {
        cookieString: 'a=1; bad=x,y; sid=AAA',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['sid', 'AAA'],
        ],
        skipped: [{ offset: 5, length: 7, name: 'bad' }],
      },
      {
        cookieString: 'last=Mon, 20 Nov 2026 10:00:00 GMT; sid=AAA',
        strict: strictModes,
        pairs: [['sid', 'AAA']],
        skipped: [{ offset: 0, length: 34, name: 'last' }],
      },
      {
        cookieString: 'x={"a":1}; sid=AAA',
        strict: [true],
        pairs: [['sid', 'AAA']],
        skipped: [{ offset: 0, length: 9, name: 'x' }],
      },
      {
        cookieString: 'x={"a":1}; sid=AAA',
        strict: [false],
        pairs: [
          ['x', '{"a":1}'],
          ['sid', 'AAA'],
        ],
        skipped: [],
      },
      {
        cookieString: 'flag; sid=AAA',
        strict: strictModes,
        pairs: [['sid', 'AAA']],
        skipped: [{ offset: 0, length: 4 }],
      },
      {
        cookieString: 'a=1;sid=AAA',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['sid', 'AAA'],
        ],
        skipped: [],
      },
      {
        cookieString: 'a=1; sid=AAA;',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['sid', 'AAA'],
        ],
        skipped: [],
      },
      {
        cookieString: 'bad=x y; sid=AAA; sid=B B',
        strict: strictModes,
        pairs: [['sid', 'AAA']],
        skipped: [
          { offset: 0, length: 7, name: 'bad' },
          { offset: 18, length: 7, name: 'sid' },
        ],
      },
      { cookieString: '', strict: strictModes, pairs: [], skipped: [] },
      {
        cookieString: 'bad=x y',
        strict: strictModes,
        pairs: [],
        skipped: [{ offset: 0, length: 7, name: 'bad' }],
      },
      { cookieString: ' \t;; ; ', strict: strictModes, pairs: [], skipped: [] },
      {
        cookieString: 'a = 1',
        strict: [true],
        pairs: [],
        skipped: [{ offset: 0, length: 5, name: 'a' }],
      },
      { cookieString: 'a = 1', strict: [false], pairs: [['a', '1']], skipped: [] },
      {
        cookieString: '  a=1  ;  b=x y  ;  c=2  ',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['c', '2'],
        ],
        skipped: [{ offset: 10, length: 5, name: 'b' }],
      },
      {
        cookieString: 'a=1; =x; b=2',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['b', '2'],
        ],
        skipped: [{ offset: 5, length: 2, name: '' }],
      },
      {
        cookieString: 'a=1; b =x y; c=2',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['c', '2'],
        ],
        skipped: [{ offset: 5, length: 6, name: 'b' }],
      },
      {
        cookieString: 'a=1; b=\u0000; c=2',
        strict: strictModes,
        pairs: [
          ['a', '1'],
          ['c', '2'],
        ],
        skipped: [{ offset: 5, length: 3, name: 'b' }],
      },
    ];

    acceptance.forEach(({ cookieString, strict: modes, pairs, skipped }) => {
      modes.forEach((strict) => {
        specify(`${JSON.stringify(cookieString)} (strict: ${strict})`, function () {
          const parseResult = parseEntries(cookieString, { strict });

          assert.isTrue(parseResult.result.success);
          assert.deepEqual(parseResult.tree, pairs);
          assert.deepEqual(parseResult.skipped, skipped);
        });
      });
    });

    specify('should report segments of bare CR and LF whole', function () {
      strictModes.forEach((strict) => {
        assert.deepEqual(parseEntries('a=1; \r\n; b=2', { strict }).skipped, [
          { offset: 5, length: 2 },
        ]);
        assert.deepEqual(parseEntries('\r', { strict }).skipped, [{ offset: 0, length: 1 }]);
        assert.deepEqual(parseEntries('x \r\n', { strict }).skipped, [{ offset: 0, length: 4 }]);
      });
    });

    specify('should not let a skipped segment change what its neighbours parse to', function () {
      strictModes.forEach((strict) => {
        assert.deepEqual(
          parseEntries('a=1; bad=x y; sid=AAA', { strict }).tree,
          parseEntries('a=1; sid=AAA', { strict }).tree,
        );
      });
    });

    specify('should cut quoted values at ";" in lenient mode', function () {
      const parseResult = parseEntries('x="a;b"; sid=AAA', { strict: false });

      assert.deepEqual(parseResult.tree, [
        ['x', '"a'],
        ['sid', 'AAA'],
      ]);
      assert.deepEqual(parseResult.skipped, [{ offset: 5, length: 2 }]);
    });

    specify('should accept quoted values with whitespace in lenient mode', function () {
      const parseResult = parseEntries('x="a b"; sid=AAA', { strict: false });

      assert.deepEqual(parseResult.tree, [
        ['x', '"a b"'],
        ['sid', 'AAA'],
      ]);
      assert.deepEqual(parseResult.skipped, []);
    });

    specify('should report offsets in UTF-16 code units', function () {
      const cookieString = '\u{1F600}=1; b=x y; c=2';
      const parseResult = parseEntries(cookieString);

      assert.deepEqual(parseResult.tree, [['c', '2']]);
      assert.deepEqual(
        parseResult.skipped.map(({ offset, length }) =>
          cookieString.slice(offset, offset + length),
        ),
        ['\u{1F600}=1', 'b=x y'],
      );
    });

    specify('should default to strict pairs', function () {
      const parseResult = parseCookie('x={"a":1}; sid=AAA', { recover: true });

      assert.deepEqual(parseResult.tree, {
        type: 'CookieString',
        pairs: [{ type: 'CookiePair', name: 'sid', value: 'AAA' }],
      });
      assert.deepEqual(parseResult.skipped, [{ offset: 0, length: 9, name: 'x' }]);
    });

    specify('should produce the same node types with every translator', function () {
      strictModes.forEach((strict) => {
        const cst = parseCookie('a=1; b=x y', {
          recover: true,
          strict,
          translator: new CSTTranslator(),
        }).tree;
        const list = parseCookie('a=1; b=x y', {
          recover: true,
          strict,
          translator: new ListTranslator(),
        }).tree;
        const xml = parseCookie('a=1; b=x y', {
          recover: true,
          strict,
          translator: new XMLTranslator(),
        }).tree;

        assert.strictEqual(cst.type, 'cookie-string');
        assert.deepEqual(
          cst.children.map(({ type, text }) => [type, text]),
          [['cookie-pair', 'a=1']],
        );
        assert.deepEqual(list, [
          ['cookie-string', 'a=1; b=x y'],
          ['cookie-pair', 'a=1'],
          ['cookie-name', 'a'],
          ['cookie-value', '1'],
        ]);
        // XML carries grammar rule names, as it does in lenient mode
        assert.include(
          xml,
          `<node name="${strict ? 'cookie-pair' : 'recovering-lenient-cookie-pair'}" index="0" length="3">`,
        );
      });
    });

    specify('should serve deprecated ast', function () {
      const parts = [];
      parseCookie('a=1; b=x y', { recover: true }).ast.translate(parts);

      assert.deepEqual(parts, [
        ['cookie-string', 'a=1; b=x y'],
        ['cookie-pair', 'a=1'],
        ['cookie-name', 'a'],
        ['cookie-value', '1'],
      ]);
    });

    specify('should report skipped segments without translator', function () {
      const parseResult = parseCookie('a=1; b=x y', { recover: true, translator: null });

      assert.isTrue(parseResult.result.success);
      assert.isUndefined(parseResult.tree);
      assert.deepEqual(parseResult.skipped, [{ offset: 5, length: 5, name: 'b' }]);
    });

    specify('should not attach skipped without recover option', function () {
      assert.notProperty(parseCookie('a=1'), 'skipped');
      assert.notProperty(parseCookie('a=1', { recover: false }), 'skipped');
    });

    specify('should keep behaviour without recover option', function () {
      assert.isFalse(parseCookie('a=1; bad=x y; sid=AAA').result.success);
      assert.isFalse(parseCookie('a=1; bad=x y; sid=AAA', { strict: false }).result.success);
      assert.isFalse(parseCookie('a=1; sid=AAA;', { strict: false }).result.success);
      assert.isFalse(parseCookie('', { strict: false }).result.success);
    });

    specify('should handle very long skipped segments', function () {
      const segment = `${'x'.repeat(130000)} y`;
      const parseResult = parseCookie(`a=1; ${segment}; b=2`, { recover: true, translator: null });

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parseResult.skipped, [{ offset: 5, length: segment.length }]);
    });

    specify('should trim folded whitespace from skipped segment names', function () {
      const parseResult = parseCookie('a\r\n =x y; b \t=x y', { recover: true });

      assert.deepEqual(
        parseResult.skipped.map(({ name }) => name),
        ['a', 'b'],
      );
    });

    specify('should trim names with long whitespace runs in linear time', function () {
      const name = `a${' '.repeat(100000)}b`;
      const start = Date.now();
      const parseResult = parseCookie(`${name}=x; c=1`, { recover: true, translator: null });

      assert.strictEqual(parseResult.skipped[0].name, name);
      assert.isBelow(Date.now() - start, 500);
    });

    context('given decoders', function () {
      const decoders = { value: cookieValuePercentDecoder };
      const cookieString = 'a=1; b=%E0%A4%A; bad=x y; c=%41';
      const skipped = [
        { offset: 5, length: 10, name: 'b' },
        { offset: 17, length: 7, name: 'bad' },
      ];

      specify('should skip cookie pairs that fail to decode', function () {
        strictModes.forEach((strict) => {
          const parseResult = parseCookie(cookieString, { recover: true, strict, decoders });

          assert.deepEqual(parseResult.tree, {
            type: 'CookieString',
            pairs: [
              { type: 'CookiePair', name: 'a', value: '1' },
              { type: 'CookiePair', name: 'c', value: 'A' },
            ],
          });
          assert.deepEqual(parseResult.skipped, skipped);
        });
      });

      specify('should skip cookie pairs that fail to decode with derived translators', function () {
        const entries = parseCookie(cookieString, {
          recover: true,
          translator: new EntriesTranslator({ decoders }),
        });
        const object = parseCookie(cookieString, {
          recover: true,
          translator: new ObjectTranslator({ decoders }),
        });

        assert.deepEqual(entries.tree, [
          ['a', '1'],
          ['c', 'A'],
        ]);
        assert.deepEqual(entries.skipped, skipped);
        assert.deepEqual({ ...object.tree }, { a: '1', c: 'A' });
        assert.deepEqual(object.skipped, skipped);
      });

      specify('should let a later duplicate win when the first fails to decode', function () {
        const parseResult = parseCookie('sid=%ZZ; sid=%41', {
          recover: true,
          translator: new ObjectTranslator({ decoders }),
        });

        assert.deepEqual({ ...parseResult.tree }, { sid: 'A' });
        assert.deepEqual(parseResult.skipped, [{ offset: 0, length: 7, name: 'sid' }]);
      });

      specify('should report undecodable pairs in UTF-16 code units', function () {
        const input = '\u{1F600}=1; b=%ZZ; c=1';
        const parseResult = parseCookie(input, {
          recover: true,
          translator: new ASTTranslator({ decoders }),
        });

        assert.deepEqual(
          parseResult.skipped.map(({ offset, length }) => input.slice(offset, offset + length)),
          ['\u{1F600}=1', 'b=%ZZ'],
        );
      });

      specify('should report undecodable names', function () {
        const parseResult = parseCookie('a=1; %ZZ=2', {
          recover: true,
          decoders: { name: cookieValuePercentDecoder },
        });

        assert.deepEqual(parseResult.tree.pairs, [{ type: 'CookiePair', name: 'a', value: '1' }]);
        assert.deepEqual(parseResult.skipped, [{ offset: 5, length: 5, name: '%ZZ' }]);
      });

      specify('should report undecodable lenient pairs without trailing whitespace', function () {
        const parseResult = parseCookie('%ZZ=  ; b=1', {
          recover: true,
          strict: false,
          decoders: { name: cookieValuePercentDecoder },
        });

        assert.deepEqual(parseResult.skipped, [{ offset: 0, length: 4, name: '%ZZ' }]);
      });

      specify('should not swallow errors other than decoder errors', function () {
        class BuggyTranslator extends EntriesTranslator {
          transformCookiePair(node, onDecodeError) {
            if (node.text.startsWith('b')) throw new Error('bug');
            return super.transformCookiePair(node, onDecodeError);
          }
        }

        assert.throws(
          () => parseCookie('a=1; b=2', { recover: true, translator: new BuggyTranslator() }),
          'Unexpected error',
        );
      });

      specify('should skip errors of custom decoders', function () {
        const decoder = (value) => {
          if (value === 'x') throw new RangeError('custom');
          return value;
        };
        const parseResult = parseCookie('a=x; b=2', {
          recover: true,
          decoders: { value: decoder },
        });

        assert.deepEqual(parseResult.tree.pairs, [{ type: 'CookiePair', name: 'b', value: '2' }]);
        assert.deepEqual(parseResult.skipped, [{ offset: 0, length: 3, name: 'a' }]);
      });

      specify('should throw without recover option', function () {
        assert.throws(() => parseCookie('a=1; b=%ZZ', { decoders }), 'Unexpected error');
        assert.throws(() => parseSetCookie('a=%ZZ', { decoders }), 'Unexpected error');
        assert.throws(() => parseCookie('a=!', { decoders: { value: cookieValueBase64Decoder } }));
      });
    });

    specify('should work with stats and trace', function () {
      const parseResult = parseCookie('a=1; b=x y', { recover: true, stats: true, trace: true });

      assert.isString(parseResult.stats.displayStats());
      assert.isString(parseResult.trace.displayTrace());
    });
  });
});
