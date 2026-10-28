/**
 * Smoke test of the built artifacts, as consumers load them: CommonJS, ES module, UMD (require and browser global).
 * Resolves the package by its name, so it runs both inside this repository (self-reference)
 * and in a project the packed tarball is installed into.
 * Written in syntax supported by the oldest supported Node.js version (see engines in package.json).
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const name = '@swaggerexpert/cookie';
const root = path.dirname(require.resolve(`${name}/package.json`));

// values created in a different realm (vm context) have different prototypes, so compare their JSON
const assertJSONEqual = (actual, expected) =>
  assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));

const check = (label, Cookie) => {
  const parseResult = Cookie.parseCookie('foo=bar; baz="raz"');
  assertJSONEqual(parseResult.tree, {
    type: 'CookieString',
    pairs: [
      { type: 'CookiePair', name: 'foo', value: 'bar' },
      { type: 'CookiePair', name: 'baz', value: '"raz"' },
    ],
  });

  // deprecated ast retained for backward compatibility
  const parts = [];
  parseResult.ast.translate(parts);
  assertJSONEqual(parts, [
    ['cookie-string', 'foo=bar; baz="raz"'],
    ['cookie-pair', 'foo=bar'],
    ['cookie-name', 'foo'],
    ['cookie-value', 'bar'],
    ['cookie-pair', 'baz="raz"'],
    ['cookie-name', 'baz'],
    ['cookie-value', '"raz"'],
  ]);

  assert.strictEqual(Cookie.parseCookie('foo = bar', { strict: false }).result.success, true);
  assert.strictEqual(Cookie.testCookie('foo=bar'), true);
  assert.strictEqual(Cookie.testCookie('foo'), false);
  assert.strictEqual(Cookie.testCookieName('session_id'), true);
  assert.strictEqual(Cookie.testCookieName('session id'), false);
  assert.strictEqual(Cookie.testCookieValue('"bar"', { quoted: false }), false);

  assert.strictEqual(Cookie.serializeCookie({ foo: 'bar', baz: 'raz' }), 'foo=bar; baz=raz');
  assert.strictEqual(Cookie.serializeSetCookie('foo', ';'), 'foo=Ow');
  assert.strictEqual(
    Cookie.serializeSetCookie('foo', 'bar', {
      expires: new Date(0),
      maxAge: 0,
      path: '/',
      secure: true,
      sameSite: 'lax',
    }),
    'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; Secure; SameSite=Lax',
  );
  const setCookie = Cookie.parseSetCookie(
    'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=0; Path=/; HttpOnly; Foo=bar',
  ).tree;
  assert.strictEqual(setCookie.name, 'id');
  assert.strictEqual(setCookie.attributes.expires.toISOString(), '2027-10-21T07:28:00.000Z');
  assertJSONEqual(setCookie.extensions, [{ type: 'CookieAttribute', name: 'Foo', value: 'bar' }]);
  assert.strictEqual(
    Cookie.serializeSetCookie(setCookie.name, setCookie.value, setCookie.attributes),
    'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=0; Path=/; HttpOnly',
  );
  assert.strictEqual(Cookie.testSetCookie('id=a;Secure'), false);
  assert.strictEqual(Cookie.testSetCookie('id=a;Secure', { strict: false }), true);
  const cookieObject = Cookie.parseCookie('a=1; b=2; a=3', {
    translator: new Cookie.ObjectTranslator(),
  }).tree;
  assertJSONEqual(cookieObject, { a: '1', b: '2' });
  assert.strictEqual(Object.getPrototypeOf(cookieObject), null);
  assertJSONEqual(
    Cookie.parseCookie('a=1; b=2; a=3', { translator: new Cookie.EntriesTranslator() }).tree,
    [
      ['a', '1'],
      ['b', '2'],
      ['a', '3'],
    ],
  );
  // exercises environment specific (node/browser) base64 decoder
  assertJSONEqual(
    Cookie.parseCookie('foo=aMOpbGxv; bar=en', {
      decoders: { value: Cookie.cookieValueRotatingDecoder },
    }).tree.pairs.map((pair) => pair.value),
    ['héllo', 'en'],
  );
  // exercises environment specific (node/browser) base64 encoder
  assert.strictEqual(
    Cookie.serializeCookie(
      { foo: 'héllo' },
      { encoders: { value: Cookie.cookieValueStrictBase64Encoder } },
    ),
    'foo=aMOpbGxv',
  );

  const { trace } = Cookie.parseCookie('foo', { trace: true });
  assert.ok(Array.from(trace.inferExpectations()).indexOf('=') !== -1);

  const error = new Cookie.CookieParseError('message');
  assert.strictEqual(error.name, 'CookieParseError');
  assert.ok(error instanceof Cookie.CookieError);
  assert.strictEqual(new Cookie.CookieError('message').name, 'CookieError');

  assert.strictEqual(typeof new Cookie.Grammar().toString(), 'string');

  console.log(`ok ${label}`);
};

const main = async () => {
  check('CommonJS', require(name));
  check('ES module', await import(name));

  // UMD bundles target browsers (browser-production in .browserslistrc) and use browser APIs (btoa, atob),
  // Node.js >= 16 provides them as globals and can require the bundles
  if (Number(process.versions.node.split('.')[0]) < 16) {
    console.log('skip UMD bundles on Node.js < 16');
  } else {
    ['cookie.browser.js', 'cookie.browser.min.js'].forEach((file) => {
      const bundlePath = path.join(root, 'dist', file);

      check(`UMD require ${file}`, require(bundlePath));

      const context = { btoa, atob, TextEncoder, TextDecoder };
      context.self = context;
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(bundlePath, 'utf8'), context);
      check(`UMD browser global ${file}`, context.SwaggerExpertCookie);
    });
  }

  assert.ok(fs.readFileSync(require.resolve(`${name}/grammar.bnf`), 'utf8').length > 0);
  console.log('ok grammar.bnf');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
