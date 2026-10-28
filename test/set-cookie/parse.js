import { assert } from 'chai';
import { Stats } from 'apg-lite';

import {
  parseSetCookie,
  serializeSetCookie,
  CSTTranslator,
  ListTranslator,
  XMLTranslator,
  Trace,
  CookieError,
  CookieParseError,
  cookieValueBase64urlDecoder,
  cookieNamePercentDecoder,
} from '../../src/index.js';

const expires = new Date(Date.UTC(2027, 9, 21, 7, 28));

describe('parseSetCookie', function () {
  context('given strict mode', function () {
    specify('should parse cookie pair', function () {
      const { result, tree } = parseSetCookie('id=a3fWa');

      assert.isTrue(result.success);
      assert.deepEqual(tree, {
        type: 'SetCookie',
        name: 'id',
        value: 'a3fWa',
        attributes: {},
        extensions: [],
      });
    });

    specify('should parse all attributes', function () {
      const { tree } = parseSetCookie(
        'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=3600; Domain=example.com; Path=/docs; Secure; HttpOnly; SameSite=Lax; Partitioned; Priority=High',
      );

      assert.deepEqual(tree.attributes, {
        expires,
        maxAge: 3600,
        domain: 'example.com',
        path: '/docs',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        partitioned: true,
        priority: 'high',
      });
      assert.deepEqual(tree.extensions, []);
    });

    specify('should parse quoted value', function () {
      assert.strictEqual(parseSetCookie('id="a3fWa"').tree.value, '"a3fWa"');
    });

    specify('should collect unrecognized attributes as extensions', function () {
      const { tree } = parseSetCookie('id=a; Foo=bar; Baz');

      assert.deepEqual(tree.extensions, [
        { type: 'CookieAttribute', name: 'Foo', value: 'bar' },
        { type: 'CookieAttribute', name: 'Baz' },
      ]);
    });

    specify('should interpret attributes matched as extension-av', function () {
      // Max-Age=0 is not max-age-av per grammar, but still processed per RFC 6265, Section 5.2.2
      assert.strictEqual(parseSetCookie('id=a; Max-Age=0').tree.attributes.maxAge, 0);
    });

    specify('should fail on invalid Set-Cookie strings', function () {
      ['', 'id', '=a', 'id=a;Secure', 'id=a ; Secure', 'id=a b', 'i d=a', 'id=a; Path=/;'].forEach(
        (setCookieString) => {
          assert.isFalse(parseSetCookie(setCookieString).result.success, setCookieString);
        },
      );
    });

    specify('should not produce tree for invalid Set-Cookie string', function () {
      assert.isUndefined(parseSetCookie('id').tree);
    });
  });

  context('given lenient mode', function () {
    specify('should trim whitespace around names and values', function () {
      const { tree } = parseSetCookie('  id = a b  ;  Path = /docs  ;Secure  ', { strict: false });

      assert.deepEqual(tree, {
        type: 'SetCookie',
        name: 'id',
        value: 'a b',
        attributes: { path: '/docs', secure: true },
        extensions: [],
      });
    });

    specify('should match attribute names case-insensitively', function () {
      const { tree } = parseSetCookie('id=a; max-age=60; HTTPONLY; samesite=STRICT; priority=low', {
        strict: false,
      });

      assert.deepEqual(tree.attributes, {
        maxAge: 60,
        httpOnly: true,
        sameSite: 'strict',
        priority: 'low',
      });
    });

    specify('should ignore attributes with values that cannot be processed', function () {
      const { tree } = parseSetCookie(
        'id=a; Expires=invalid; Max-Age=1.5; Max-Age=+1; Domain=; Path=docs; SameSite=bogus; Priority=urgent',
        { strict: false },
      );

      assert.deepEqual(tree.attributes, {});
      assert.deepEqual(tree.extensions, []);
    });

    specify('should use the last attribute when it appears multiple times', function () {
      const { tree } = parseSetCookie('id=a; Max-Age=1; Path=/a; Max-Age=2; Path=/b', {
        strict: false,
      });

      assert.deepEqual(tree.attributes, { maxAge: 2, path: '/b' });
    });

    specify('should normalize domain', function () {
      const { tree } = parseSetCookie('id=a; Domain=.Example.COM', { strict: false });

      assert.strictEqual(tree.attributes.domain, 'example.com');
    });

    specify('should accept negative Max-Age', function () {
      assert.strictEqual(
        parseSetCookie('id=a; Max-Age=-1', { strict: false }).tree.attributes.maxAge,
        -1,
      );
    });

    specify('should ignore values of Secure, HttpOnly and Partitioned', function () {
      const { tree } = parseSetCookie('id=a; Secure=no; HttpOnly=no; Partitioned=no', {
        strict: false,
      });

      assert.deepEqual(tree.attributes, { secure: true, httpOnly: true, partitioned: true });
    });

    specify('should parse values that strict mode rejects', function () {
      const { tree } = parseSetCookie('id=a=b,c; x', { strict: false });

      assert.strictEqual(tree.value, 'a=b,c');
      assert.deepEqual(tree.extensions, [{ type: 'CookieAttribute', name: 'x' }]);
    });

    specify('should ignore empty attributes', function () {
      const { tree } = parseSetCookie('id=a;; ;Secure;', { strict: false });

      assert.deepEqual(tree.attributes, { secure: true });
      assert.deepEqual(tree.extensions, []);
    });

    specify('should fail when cookie-pair is missing name or "="', function () {
      ['', 'id', '=a', ' = a', 'id; Secure', '\t'].forEach((setCookieString) => {
        assert.isFalse(
          parseSetCookie(setCookieString, { strict: false }).result.success,
          setCookieString,
        );
      });
    });

    specify('should fail on control characters', function () {
      assert.isFalse(parseSetCookie('id=a\u0001b', { strict: false }).result.success);
    });
  });

  context('round trip', function () {
    specify('should produce attributes accepted by serializeSetCookie', function () {
      const setCookieString =
        'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=3600; Domain=example.com; Path=/docs; Secure; HttpOnly; SameSite=Lax; Partitioned; Priority=High';
      const { tree } = parseSetCookie(setCookieString);

      assert.strictEqual(
        serializeSetCookie(tree.name, tree.value, tree.attributes),
        setCookieString,
      );
    });
  });

  context('decoders', function () {
    specify('should decode name and value', function () {
      const { tree } = parseSetCookie('a%25=Ow; Path=/', {
        decoders: { name: cookieNamePercentDecoder, value: cookieValueBase64urlDecoder },
      });

      assert.strictEqual(tree.name, 'a%');
      assert.strictEqual(tree.value, ';');
    });
  });

  context('translators', function () {
    specify('should translate to CST', function () {
      const { tree } = parseSetCookie(' a = b ;Path=/', {
        strict: false,
        translator: new CSTTranslator(),
      });

      assert.deepEqual(tree, {
        type: 'set-cookie-string',
        text: ' a = b ;Path=/',
        start: 0,
        length: 14,
        children: [
          {
            type: 'cookie-pair',
            text: ' a = b ',
            start: 0,
            length: 7,
            children: [
              { type: 'cookie-name', text: 'a', start: 1, length: 1, children: [] },
              { type: 'cookie-value', text: 'b', start: 5, length: 1, children: [] },
            ],
          },
          { type: 'cookie-av', text: 'Path=/', start: 8, length: 6, children: [] },
        ],
      });
    });

    specify('should translate to list of entries', function () {
      const { tree } = parseSetCookie('a=b; Path=/', { translator: new ListTranslator() });

      assert.deepEqual(tree, [
        ['set-cookie-string', 'a=b; Path=/'],
        ['cookie-pair', 'a=b'],
        ['cookie-name', 'a'],
        ['cookie-value', 'b'],
        ['cookie-av', 'Path=/'],
      ]);
    });

    specify('should translate to XML', function () {
      const { tree } = parseSetCookie('a=b; Path=/', { translator: new XMLTranslator() });

      assert.include(tree, '<node name="set-cookie-string" index="0" length="11">');
      assert.include(tree, '<node name="cookie-av" index="5" length="6">');
    });

    specify('should only validate when no translator is provided', function () {
      const { result, tree } = parseSetCookie('a=b', { translator: null });

      assert.isTrue(result.success);
      assert.isUndefined(tree);
    });
  });

  context('stats and trace', function () {
    specify('should produce stats when requested', function () {
      assert.instanceOf(parseSetCookie('a=b', { stats: true }).stats, Stats);
      assert.isUndefined(parseSetCookie('a=b').stats);
    });

    specify('should produce trace when requested', function () {
      const { trace } = parseSetCookie('a', { trace: true });

      assert.instanceOf(trace, Trace);
      assert.include(trace.inferExpectations(), '=');
    });
  });

  context('errors', function () {
    specify('should throw TypeError on non-string input', function () {
      [1, null, undefined, {}, []].forEach((value) => {
        assert.throws(() => parseSetCookie(value), TypeError, 'Set-Cookie string must be a string');
      });
    });

    specify('should wrap unexpected errors in CookieParseError', function () {
      try {
        parseSetCookie('a=bar', { decoders: { value: cookieValueBase64urlDecoder } });
        assert.fail('should have thrown');
      } catch (error) {
        assert.instanceOf(error, CookieParseError);
        assert.instanceOf(error, CookieError);
        assert.strictEqual(error.setCookieString, 'a=bar');
      }
    });
  });
});
