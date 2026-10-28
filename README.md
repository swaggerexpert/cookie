# @swaggerexpert/cookie

[![npmversion](https://badge.fury.io/js/@swaggerexpert%2Fcookie.svg)](https://www.npmjs.com/package/@swaggerexpert/cookie)
[![npm](https://img.shields.io/npm/dm/@swaggerexpert/cookie)](https://www.npmjs.com/package/@swaggerexpert/cookie)
[![Test workflow](https://github.com/swaggerexpert/cookie/actions/workflows/test.yml/badge.svg)](https://github.com/swaggerexpert/cookie/actions)
[![Dependabot enabled](https://img.shields.io/badge/Dependabot-enabled-blue.svg)](https://dependabot.com/)
[![try on RunKit](https://img.shields.io/badge/try%20on-RunKit-brightgreen.svg?style=flat)](https://npm.runkit.com/@swaggerexpert/cookie)
[![](https://data.jsdelivr.com/v1/package/npm/@swaggerexpert/cookie/badge)](https://www.jsdelivr.com/package/npm/@swaggerexpert/cookie)
[![Tidelift](https://tidelift.com/badges/package/npm/@swaggerexpert%2Fcookie)](https://tidelift.com/subscription/pkg/npm-.swaggerexpert-cookie?utm_source=npm-swaggerexpert-cookie&utm_medium=referral&utm_campaign=readme)

`@swaggerexpert/cookie` is [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265) compliant cookie `parser`, `validator` and `serializer`.

The development of this library contributed to the identification and formal submission of [Errata ID: 8242](https://www.rfc-editor.org/errata/eid8242) against the RFC 6265.

<table>
  <tr>
    <td align="right" valign="middle">
        <img src="https://raw.githubusercontent.com/swaggerexpert/cookie/main/assets/tidelift.webp" alt="Tidelift" width="60" />
      </td>
      <td valign="middle">
        <a href="https://tidelift.com/subscription/pkg/npm-.swaggerexpert-cookie?utm_source=npm-swaggerexpert-cookie&utm_medium=referral&utm_campaign=readme">
            Get professionally supported @swaggerexpert/cookie with Tidelift Subscription.
        </a>
      </td>
  </tr>
</table>

## Table of Contents

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Cookie](#cookie)
      - [Parsing cookie](#parsing-cookie)
        - [Translators](#translators)
        - [Statistics](#statistics)
        - [Tracing](#tracing)
      - [Validating cookie](#validating-cookie)
      - [Serializing cookie](#serializing-cookie)
    - [Set-Cookie](#set-cookie)
      - [Parsing Set-Cookie](#parsing-set-cookie)
      - [Validating Set-Cookie](#validating-set-cookie)
      - [Serializing Set-Cookie](#serializing-set-cookie)
    - [Encoders](#encoders)
      - [Generic encoders](#generic-encoders)
      - [Cookie Name encoders](#cookie-name-encoders)
      - [Cookie Value encoders](#cookie-value-encoders)
    - [Decoders](#decoders)
      - [Generic decoders](#generic-decoders)
      - [Cookie Name decoders](#cookie-name-decoders)
      - [Cookie Value decoders](#cookie-value-decoders)
    - [Validators](#validators)
      - [Cookie Name validators](#cookie-name-validators)
      - [Cookie Value validators](#cookie-value-validators)
    - [Errors](#errors)
    - [Grammar](#grammar)
- [More about RFC 6265](#more-about-rfc-6265)
- [License](#license)

## Getting started

### Installation

You can install `@swaggerexpert/cookie` using `npm`:

```sh
 $ npm install @swaggerexpert/cookie
```

---

**[unpkg.com](https://unpkg.com/)**

Include following script tag into your HTML file:

```html
<script src="https://unpkg.com/@swaggerexpert/cookie@latest/dist/cookie.browser.min.js"></script>
```

Global variable `SwaggerExpertCookie` will be available in the browser matching interface of `@swaggerexpert/cookie` npm package.
`cookie.browser.min.js` is [UMD](https://github.com/umdjs/umd?tab=readme-ov-file#umd-universal-module-definition) minified build artifact.
There is also unminified `cookie.browser.js` artifact, suitable for debugging.
The browser artifacts target the latest browsers; they can also be loaded via `require` in Node.js >= 16.

---

**[jsDelivr](https://www.jsdelivr.com/)**

Include following script tag into your HTML file (ESM mode):

```html
<script type="module">
  import * as SwaggerExpertCookie from 'https://cdn.jsdelivr.net/npm/@swaggerexpert/cookie@latest/+esm'
</script>
```
Local variable `SwaggerExpertCookie` will be available in scope of the `<script>` tag matching interface of `@swaggerexpert/cookie` package.

Or include following script tag into your HTML file (UMD mode):

```html
<script src="https://cdn.jsdelivr.net/npm/@swaggerexpert/cookie@latest/dist/cookie.browser.min.js"></script>
```

Global variable `SwaggerExpertCookie` will be available in the browser matching interface of `@swaggerexpert/cookie` npm package.
`cookie.browser.min.js` is [UMD](https://github.com/umdjs/umd?tab=readme-ov-file#umd-universal-module-definition) minified build artifact.
There is also unminified `cookie.browser.js` artifact, suitable for debugging.

### Usage

`@swaggerexpert/cookie` currently supports **parsing**, **validation** and **serialization**.
Parser is based on a superset of [ABNF](https://www.rfc-editor.org/rfc/rfc5234) ([SABNF](https://cs.github.com/ldthomas/apg-js2/blob/master/SABNF.md))
and uses [apg-lite](https://github.com/ldthomas/apg-lite) parser generator.

#### Cookie

The `Cookie` header is an HTTP header used to send cookies from the client (e.g., a browser) to the server.
The `Cookie` header is sent in HTTP requests and contains one or more cookies that the server previously set
via the `Set-Cookie` header. Cookies are formatted as key-value pairs, separated by semicolons (`;`),
and do not include metadata like `Path`, `Domain`, or `HttpOnly`.

##### Parsing Cookie

Parsing a cookie is as simple as importing the **parseCookie** function and calling it.

```js
import { parseCookie } from '@swaggerexpert/cookie';

const parseResult = parseCookie('foo=bar');
parseResult.result.success; // => true
```

The **lenient** mode for cookie parsing is designed to handle and extract valid
cookie-pairs from potentially malformed or non-standard cookie strings.
It focuses on maintaining compatibility with real-world scenarios where cookie
headers may deviate from strict compliance with RFC 6265.

```js
import { parseCookie } from '@swaggerexpert/cookie';

/**
 * All of the following parse successfully.
 */

parseCookie('foo1=bar;  foo2=baz', { strict: false });
parseCookie('foo1=bar;foo2=baz', { strict: false });
parseCookie('FOO    = bar;   baz  =   raz', { strict: false });
parseCookie('foo="bar=123456789&name=Magic+Mouse"', { strict: false });
parseCookie('foo  =  "bar"', { strict: false });
parseCookie('foo  =  bar  ;  fizz  =  buzz', { strict: false });
parseCookie('foo =', { strict: false });
parseCookie('\tfoo\t=\tbar\t', { strict: false });
parseCookie('foo1=bar;foo2=baz', { strict: false });
parseCookie('foo1=bar;  foo2=baz', { strict: false });
parseCookie('foo=bar; fizz; buzz', { strict: false });
parseCookie('fizz; buzz; foo=bar', { strict: false });
parseCookie('name=name=3', { strict: false });
parseCookie('name:name=3', { strict: false });
```

**parseResult** variable has the following shape:

```
{
  result: <ParseResult['result']>,
  tree: <ParseResult['tree']>,
  stats: <ParseResult['stats']>,
  trace: <ParseResult['trace']>,
}
```

[TypeScript typings](https://github.com/swaggerexpert/cookie/blob/main/types/index.d.ts) are available for all fields attached to parse result object returned by the `parseCookie` function.

###### Translators

`@swaggerexpert/cookie` provides several translators to convert the parse result into different tree representations.
Translators produce the same node types in both strict and lenient mode.

**CST translator**

[Concrete Syntax Tree](https://en.wikipedia.org/wiki/Parse_tree) (Parse tree) representation is available on parse result
when instance of `CSTTranslator` is provided via a `translator` option to the `parseCookie` function.
CST is suitable to be consumed by other tools like IDEs, editors, etc...

```js
import { parseCookie, CSTTranslator } from '@swaggerexpert/cookie';

const { tree: cst } = parseCookie('foo=bar', { translator: new CSTTranslator() });
```

CST tree has a shape documented by [TypeScript typings (CSTNode)](https://github.com/swaggerexpert/cookie/blob/main/types/index.d.ts).

**AST translator**

**Default translator**. [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representation is available on parse result
by default or when instance of `ASTTranslator` is provided via a `translator` option to the `parseCookie` function.

```js
import { parseCookie } from '@swaggerexpert/cookie';

const { tree: ast } = parseCookie('foo=bar; baz="raz"');
```

or

```js
import { parseCookie, ASTTranslator } from '@swaggerexpert/cookie';

const { tree: ast } = parseCookie('foo=bar; baz="raz"', { translator: new ASTTranslator() });
```

After running the above code, **ast** variable has the following shape:

```js
{
  type: 'CookieString',
  pairs: [
    { type: 'CookiePair', name: 'foo', value: 'bar' },
    { type: 'CookiePair', name: 'baz', value: '"raz"' },
  ],
}
```

Cookie values are raw, exactly as they appear in the cookie string (including the surrounding DQUOTEs, if present).
AST tree has a shape documented by [TypeScript typings (ASTNode)](https://github.com/swaggerexpert/cookie/blob/main/types/index.d.ts).

**List translator**

List of entries representation is available on parse result
when instance of `ListTranslator` is provided via a `translator` option to the `parseCookie` function.
Every entry is a `[type, text]` tuple, ordered as matched by the parser.

```js
import { parseCookie, ListTranslator } from '@swaggerexpert/cookie';

const { tree: list } = parseCookie('foo=bar', { translator: new ListTranslator() });
```

After running the above code, **list** variable has the following shape:

```js
[
  ['cookie-string', 'foo=bar'],
  ['cookie-pair', 'foo=bar'],
  ['cookie-name', 'foo'],
  ['cookie-value', 'bar'],
]
```

> NOTE: for backward compatibility, parse result also exposes the deprecated `ast` field,
> regardless of the translator used. `parseResult.ast.translate(parts)` populates `parts` with the same list of entries
> as `ListTranslator` produces, and `parseResult.ast.toXml()` returns XML representation. Prefer translators in new code.

**Object translator**

Object representation, mapping cookie names to cookie values, is available on parse result
when instance of `ObjectTranslator` is provided via a `translator` option to the `parseCookie` function.

```js
import { parseCookie, ObjectTranslator } from '@swaggerexpert/cookie';

const { tree: cookies } = parseCookie('foo=bar; baz=raz; foo=boo', { translator: new ObjectTranslator() });
// => { foo: 'bar', baz: 'raz' }
```

When a cookie name appears multiple times, the first cookie value wins. This is a convention: user agents SHOULD send cookies
with longer paths first ([RFC 6265, Section 5.4](https://datatracker.ietf.org/doc/html/rfc6265#section-5.4)), but servers
SHOULD NOT rely on the order ([RFC 6265, Section 4.2.2](https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.2)).
Use [entries translator](#translators) or the AST to access all cookie pairs.

The object has `null` prototype, so cookie names like `__proto__` or `constructor` are plain own properties,
and lookups of absent cookie names (e.g. `cookies.toString`) are `undefined`. Order of the object keys follows
JavaScript property order, i.e. integer-like cookie names come first; use entries translator when the order matters.

As the object doesn't inherit from `Object.prototype`:

- use `Object.hasOwn(cookies, name)` or `name in cookies` instead of `cookies.hasOwnProperty(name)`
- converting the object to a string (`String(cookies)`, template literals) throws `TypeError`
- use spread (`{ ...cookies }`) to get a plain object; `Object.assign({}, cookies)` would drop a cookie named `__proto__`
- strict deep equality with plain objects (e.g. `assert.deepStrictEqual`) fails; compare `{ ...cookies }` instead

`ObjectTranslator` accepts the same `decoders` option as `ASTTranslator`:

```js
import { parseCookie, ObjectTranslator, cookieValueRotatingDecoder } from '@swaggerexpert/cookie';

const translator = new ObjectTranslator({ decoders: { value: cookieValueRotatingDecoder } });
parseCookie('foo=Ow; bar=aGVsbG8', { translator }).tree; // => { foo: ';', bar: 'hello' }
```

**Entries translator**

List of `[name, value]` entries, in order of appearance, is available on parse result
when instance of `EntriesTranslator` is provided via a `translator` option to the `parseCookie` function.
Unlike the [object translator](#translators), all cookie pairs are retained, including duplicate cookie names.

```js
import { parseCookie, serializeCookie, EntriesTranslator } from '@swaggerexpert/cookie';

const { tree: entries } = parseCookie('foo=bar; baz=raz; foo=boo', { translator: new EntriesTranslator() });
// => [['foo', 'bar'], ['baz', 'raz'], ['foo', 'boo']]

serializeCookie(entries); // => 'foo=bar; baz=raz; foo=boo'
```

Cookie strings parsed in strict mode are serialized back to the same cookie string. Cookie strings parsed in [lenient](#parsing-cookie) mode
can contain cookie names and values which the default [encoders](#encoders) and [validators](#validators) of `serializeCookie` re-encode or reject.
Use identity value encoder and lenient validators to serialize them as they are (separators are normalized to `"; "`):

```js
import {
  parseCookie,
  serializeCookie,
  EntriesTranslator,
  identity,
  cookieNameLenientValidator,
  cookieValueLenientValidator,
} from '@swaggerexpert/cookie';

const { tree: entries } = parseCookie('a="b c";x(y=b\\c', { strict: false, translator: new EntriesTranslator() });

serializeCookie(entries, {
  encoders: { value: identity },
  validators: { name: cookieNameLenientValidator, value: cookieValueLenientValidator },
}); // => 'a="b c"; x(y=b\\c'
```

`EntriesTranslator` accepts the same `decoders` option as `ASTTranslator`.
When cookie names or values are decoded, serialize them using the corresponding [encoders](#encoders) to get the original cookie string.

**XML translator**

```js
import { parseCookie, XMLTranslator } from '@swaggerexpert/cookie';

const { tree: xml } = parseCookie('foo=bar', { translator: new XMLTranslator() });
```

**No translator**

When only validity of the cookie string matters, translation can be skipped by setting `translator` option to `null`.

```js
import { parseCookie } from '@swaggerexpert/cookie';

const { result, tree } = parseCookie('foo=bar', { translator: null });
result.success; // => true
tree; // => undefined
```

###### Statistics

`parseCookie` function returns additional statistical information about the parsing process.
Collection of the statistics can be enabled by setting `stats` option to `true`.

```js
import { parseCookie } from '@swaggerexpert/cookie';

const { stats } = parseCookie('foo=bar', { stats: true });

stats.displayStats(); // returns operator statistics as string
stats.displayHits(); // returns rules grouped by hit count as string
```

###### Tracing

`parseCookie` function returns additional tracing information about the parsing process.
Tracing can be enabled by setting `trace` option to `true`. Tracing is essential
for debugging failed parses or analyzing rule execution flow.

```js
import { parseCookie } from '@swaggerexpert/cookie';

const { result, trace } = parseCookie('foo', { trace: true });

result.success; // false
trace.displayTrace(); // returns trace information as string
```

Tracing also allows you to infer expected tokens at a failure point. This is useful for generating meaningful syntax error messages.

```js
import { parseCookie } from '@swaggerexpert/cookie';

const { trace } = parseCookie('foo', { trace: true });

const expectations = trace.inferExpectations();
expectations.includes('='); // => true
```

##### Validating Cookie

Validating a cookie string is as simple as importing the **testCookie** function and calling it.

```js
import { testCookie } from '@swaggerexpert/cookie';

testCookie('foo=bar'); // => true
testCookie('foo=bar; baz=raz'); // => true
testCookie('foo=bar;baz=raz'); // => false (missing SP after semicolon)
testCookie('foo=bar;baz=raz', { strict: false }); // => true
```

Individual cookie names and values can be validated as well, using **testCookieName** and **testCookieValue** functions.
This is useful, for example, for validating `name` of [OpenAPI Parameter Objects](https://spec.openapis.org/oas/latest.html#parameter-object)
located in a cookie (`in: cookie`), which must be a valid cookie name in order to be sent in the `Cookie` header.

```js
import { testCookieName, testCookieValue } from '@swaggerexpert/cookie';

testCookieName('session_id'); // => true
testCookieName('session id'); // => false (SP is not allowed)
testCookieName('a:b'); // => false
testCookieName('a:b', { strict: false }); // => true

testCookieValue('bar'); // => true
testCookieValue('"bar"'); // => true
testCookieValue('"bar"', { quoted: false }); // => false (must not be enclosed in DQUOTEs)
testCookieValue('bar', { quoted: true }); // => false (must be enclosed in DQUOTEs)
testCookieValue('b r'); // => false (SP is not allowed)
```

##### Serializing Cookie

Serializing a cookie is as simple as importing the **serializeCookie** function and calling it.

**Serializing object**:

```js
import { serializeCookie } from '@swaggerexpert/cookie';

serializeCookie({ foo: 'bar' }); // => 'foo=bar'
serializeCookie({ foo: 'bar', baz: 'raz' }); // => 'foo=bar; baz=raz'
```

**Serializing entries**:

By using entries (list of key-value pairs), this function supports creating cookies
with duplicate names—a common scenario when sending multiple values for the same cookie name.

```js
import { serializeCookie } from '@swaggerexpert/cookie';

serializeCookie([['foo',  'bar']]); // => 'foo=bar'
serializeCookie([[ 'foo', 'bar'], ['baz', 'raz' ]]); // => 'foo=bar; baz=raz'
serializeCookie([[ 'foo', 'bar'], ['baz', 'raz' ], ['foo', 'boo']]); // => 'foo=bar; baz=raz; foo=boo'
```

**Options**

The `serializeCookie` function provides a powerful and flexible API for serializing cookies,
enabling the implementation of various scenarios. By default, it uses a set of sensible options
to ensure compliance with cookie standards. However, its behavior can be customized by overriding these defaults.

**Default Options**

[Encoders](#encoders) transform cookie names and values during serialization to ensure they meet encoding requirements.
[Validators](#validators) ensure that cookie names and values conform to the required standards. If validation fails, an error is thrown.
Validators are executed **after** encoders, ensuring that values are first transformed before being validated.

The default options for `serializeCookie` ensure strict compliance with cookie standards by applying
no encoding for cookie names, RFC compliant encoding for values, and robust validation for
both names and values according to [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265).

```js
{
  encoders: {
    name: identity,
    value: cookieValueStrictBase64urlEncoder
  },
  validators: {
    name: cookieNameStrictValidator,
    value: cookieValueStrictValidator,
  }
}
```

**Customizing serialization**

You can customize `serializeCookie` behavior by providing your own [encoders](#encoders) or [validators](#validators):

```js
import { serializeCookie } from '@swaggerexpert/cookie';

serializeCookie({ foo: 'bar' }, {
  encoders: {
    name: (name) => name.toUpperCase(), // custom name encoder
    value: (value) => encodeURIComponent(value), // custom value encoder
  },
  validators: {
    name: (name) => {
      if (!/^[a-zA-Z]+$/.test(name)) {
        throw new TypeError('Custom validation failed for cookie name');
      }
    },
    value: (value) => {
      if (value.includes(';')) {
        throw new TypeError('Custom validation failed for cookie value');
      }
    },
  },
});
```

Completely **bypassing** encoding and validation is possible as well:

```js
import { serializeCookie, identity, noop } from '@swaggerexpert/cookie';

serializeCookie({ foo: ';' }, {
  encoders: {  name: identity, value: identity },
  validators: { name: noop, value: noop },
}); // => "foo=;"
```

#### Set-Cookie

The `Set-Cookie` header is an HTTP header used to send cookies from the server to the client (e.g., a browser).
Each `Set-Cookie` header contains a single cookie formatted as key-value pair.

##### Parsing Set-Cookie

Parsing a `Set-Cookie` header is as simple as importing the **parseSetCookie** function and calling it.

```js
import { parseSetCookie } from '@swaggerexpert/cookie';

const { result, tree } = parseSetCookie(
  'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=3600; Domain=example.com; Path=/docs; Secure; HttpOnly; SameSite=Lax; Foo=bar',
);
result.success; // => true
```

After running the above code, **tree** variable has the following shape:

```js
{
  type: 'SetCookie',
  name: 'id',
  value: 'a3fWa',
  attributes: {
    expires: new Date('2027-10-21T07:28:00.000Z'),
    maxAge: 3600,
    domain: 'example.com',
    path: '/docs',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  },
  extensions: [{ type: 'CookieAttribute', name: 'Foo', value: 'bar' }],
}
```

Recognized `attributes` are interpreted following [RFC 6265, Section 5.2](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2):

- attribute names are matched case-insensitively
- `Expires` is parsed using the [cookie-date](https://datatracker.ietf.org/doc/html/rfc6265#section-5.1.1) algorithm, which recognizes various date formats (e.g. `Wednesday, 21-Oct-15 07:28:00 GMT`)
- `Max-Age` is an integer, zero and negative values included
- `Domain` is lower-cased and leading `.` is removed
- `Path` not starting with `/` resets the path to default-path, which depends on the request URI, and is therefore omitted
- `Domain` that is empty after removing leading `.` (e.g. `Domain=.`) means host-only cookie, and is therefore omitted
- `Max-Age` beyond safe integer range is clamped to `Number.MAX_SAFE_INTEGER` (or `Number.MIN_SAFE_INTEGER`)
- attributes with values that cannot be processed (e.g. `Max-Age=1.5`, `Expires=invalid`) are ignored
- when an attribute appears multiple times, the last one wins
- `SameSite`, `Partitioned` and `Priority` are recognized as well, although not part of RFC 6265

Unrecognized attributes are collected in `extensions`, in order of appearance.
The shape of `attributes` matches the [attribute options](#serializing-set-cookie) of `serializeSetCookie`, so parsed `Set-Cookie` header can be serialized back:

```js
import { parseSetCookie, serializeSetCookie } from '@swaggerexpert/cookie';

const { tree } = parseSetCookie('id=a3fWa; Max-Age=3600; Path=/; HttpOnly');
serializeSetCookie(tree.name, tree.value, tree.attributes); // => 'id=a3fWa; Max-Age=3600; Path=/; HttpOnly'
```

The **lenient** mode follows parsing algorithm of [RFC 6265, Section 5.2](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2),
which is how user agents parse `Set-Cookie` headers. Whitespace around names and values is ignored, attributes don't have to be separated by `"; "`,
and cookie name and value can contain any characters except CTLs and `;`.
CTLs (except HTAB) are rejected anywhere in the `Set-Cookie` string, as they are not allowed in [HTTP field values](https://www.rfc-editor.org/rfc/rfc9110#section-5.5).

```js
import { parseSetCookie } from '@swaggerexpert/cookie';

parseSetCookie('id=a3fWa;Secure').result.success; // => false
parseSetCookie('id=a3fWa;Secure', { strict: false }).result.success; // => true

parseSetCookie('  id = a b ; max-age=60 ;HTTPONLY', { strict: false }).tree;
// => { type: 'SetCookie', name: 'id', value: 'a b', attributes: { maxAge: 60, httpOnly: true }, extensions: [] }
```

`parseSetCookie` supports the same `decoders`, `translator`, `stats` and `trace` options as [parseCookie](#parsing-cookie).
Translators produce `set-cookie-string`, `cookie-pair`, `cookie-name`, `cookie-value` and `cookie-av` nodes in both strict and lenient mode.

##### Validating Set-Cookie

```js
import { testSetCookie } from '@swaggerexpert/cookie';

testSetCookie('id=a3fWa; Path=/; Secure'); // => true
testSetCookie('id=a3fWa;Secure'); // => false
testSetCookie('id=a3fWa;Secure', { strict: false }); // => true
testSetCookie('id'); // => false
```

##### Serializing Set-Cookie

Serializing a single cookie pair for the `Set-Cookie` header is as simple as importing the **serializeSetCookie** function and calling it.

```js
import { serializeSetCookie } from '@swaggerexpert/cookie';

serializeSetCookie('foo', 'bar'); // => 'foo=bar'
serializeSetCookie('foo', ';'); // => 'foo=Ow' (base64url encoding)
```

`serializeSetCookie` accepts the same [options](#serializing-cookie) as `serializeCookie`, with the same defaults:

```js
import { serializeSetCookie, cookieValueStrictPercentEncoder } from '@swaggerexpert/cookie';

serializeSetCookie('foo', 'b r', {
  encoders: { value: cookieValueStrictPercentEncoder },
}); // => 'foo=b%20r'
```

**Attributes**

[Set-Cookie attributes](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2) are provided as options:

```js
import { serializeSetCookie } from '@swaggerexpert/cookie';

serializeSetCookie('id', 'a3fWa', {
  expires: new Date(Date.UTC(2027, 9, 21, 7, 28)),
  maxAge: 3600,
  domain: 'example.com',
  path: '/docs',
  secure: true,
  httpOnly: true,
  sameSite: 'lax',
  partitioned: true,
  priority: 'high',
});
// => 'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=3600; Domain=example.com; Path=/docs; Secure; HttpOnly; SameSite=Lax; Partitioned; Priority=High'
```

| Option | Type | Attribute |
|---|---|---|
| `expires` | `Date` | [`Expires`](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.1), serialized as `rfc1123-date` |
| `maxAge` | integer (seconds) | [`Max-Age`](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.2) |
| `domain` | `string` | [`Domain`](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.3), must be a valid subdomain ([RFC 1034](https://datatracker.ietf.org/doc/html/rfc1034#section-3.5), [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123#section-2.1)) |
| `path` | `string` | [`Path`](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.4), any CHAR except CTLs or `;` |
| `secure` | `boolean` | [`Secure`](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.5) |
| `httpOnly` | `boolean` | [`HttpOnly`](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.2.6) |
| `sameSite` | `'strict'` \| `'lax'` \| `'none'` | [`SameSite`](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-4.1.2.7) |
| `partitioned` | `boolean` | [`Partitioned`](https://datatracker.ietf.org/doc/html/draft-cutler-httpbis-partitioned-cookies) |
| `priority` | `'low'` \| `'medium'` \| `'high'` | [`Priority`](https://datatracker.ietf.org/doc/html/draft-west-cookie-priority-00#section-4.1) |

Attribute values are validated and `TypeError` is thrown when invalid. `SameSite`, `Partitioned` and `Priority` are not part of RFC 6265
and are serialized as `extension-av`. Option values of `sameSite` and `priority` are case-insensitive.

> NOTE: RFC 6265 grammar requires `Max-Age` to be a non-zero positive integer, but [user agent processing](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.2)
> defines zero and negative values as immediate expiration, which is the common way of deleting a cookie. Therefore, any integer is allowed.
> Similarly, leading `.` in `domain` is tolerated, as it is [ignored by user agents](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.3).

Attributes are never part of the `Cookie` header; `serializeCookie` ignores them.

#### Encoders

The `@swaggerexpert/cookie` library provides a suite of encoders designed to handle cookie names and values during **serialization**.
Each encoder adheres to specific rules for encoding characters, ensuring compatibility with cookie-related standards.
Below is a detailed overview of the available encoders.

##### Generic Encoders

Generic encoders can be used both for cookie names and values.

**base64**

Encodes a string using the [Base64](https://datatracker.ietf.org/doc/html/rfc4648) algorithm. Base64 encoding
is explicitly mentioned in [RFC 6265, section 4.1.1](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1) as an example of appropriate encoding for cookie values.

```js
import { base64Encoder } from '@swaggerexpert/cookie';

base64Encoder('foo<'); // => 'Zm9vPA=='
```

**base64url**

Encodes a string using the [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) algorithm.
This encoding consists of Base64 Encoding with URL and Filename Safe Alphabet.

```js
import { base64urlEncoder } from '@swaggerexpert/cookie';

base64urlEncoder('foo<'); // => 'Zm9vPA'
```

##### Cookie Name Encoders

**cookieNameStrictPercentEncoder**

Percent-encodes characters that fall outside the allowable set defined by the `cookie-name` rule in [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).

- **Use Case**: Ensures that the cookie name strictly adheres to the `cookie-name` non-terminal rule.

```js
import { cookieNameStrictPercentEncoder } from '@swaggerexpert/cookie';

cookieNameStrictPercentEncoder('foo<'); // => 'foo%3C'
```

**cookieNameLenientPercentEncoder**

Percent-encodes characters that fall outside the allowable set defined by the `lenient-cookie-name` rule.
This allows for a more lenient interpretation of cookie names.

- **Use Case**: Useful in scenarios where broader compatibility is required, or when leniency in cookie names is acceptable.

```js
import { cookieNameLenientPercentEncoder } from '@swaggerexpert/cookie';

cookieNameLenientPercentEncoder('foo<'); // => 'foo<'
```

##### Cookie Value Encoders

**cookieValueStrictBase64Encoder**

Applies [Base64](https://datatracker.ietf.org/doc/html/rfc4648) encoding to a cookie value if any of its characters fall outside the allowable set defined by the `cookie-value` rule in  [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).

- **Use Case**: To achieve the best compatibility, Base64 encoding is mentioned by RFC 6265 as an example of appropriate encoding to use. Ensures strict compliance with the `cookie-value` non-terminal rule.

```js
import { cookieValueStrictBase64Encoder } from '@swaggerexpert/cookie';

cookieValueStrictBase64Encoder(';'); // => Ow==
cookieValueStrictBase64Encoder('";"'); // => "Ow=="
```

**cookieValueStrictBase64urlEncoder**

Applies [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoding to a cookie value if any of its characters fall outside the allowable set defined by the `cookie-value` rule in  [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).

- **Use Case**: More appropriate for modern tooling, it ensures strict compliance with the `cookie-value` non-terminal rule by producing encoded value with URL and Filename Safe Alphabet.

```js
import { cookieValueStrictBase64Encoder } from '@swaggerexpert/cookie';

cookieValueStrictBase64Encoder(';'); // => Ow
cookieValueStrictBase64Encoder('";"'); // => "Ow"
```

**cookieValueStrictPercentEncoder**

Percent-encodes characters that fall outside the allowable set defined by the `cookie-value` rule in [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).

- **Use Case**: Ensures strict compliance with the `cookie-value` non-terminal rule, encoding characters such as `;` and `,`.

```js
import { cookieValueStrictPercentEncoder } from '@swaggerexpert/cookie';

cookieValueStrictPercentEncoder(';'); // => '%3B'
```

**cookieValueLenientBase64Encoder**

Applies [Base64](https://datatracker.ietf.org/doc/html/rfc4648) encoding to a cookie value if any of its characters fall outside the allowable set defined by the `lenient-cookie-value`.

- **Use Case**: To achieve the best compatibility, Base64 encoding is mentioned by RFC 6265 as an example of appropriate encoding to use. Useful when broader compatibility is needed, and when leniency in cookie values is acceptable.

```js
import { cookieValueLenientBase64Encoder } from '@swaggerexpert/cookie';

cookieValueLenientBase64Encoder(';'); // => Ow==
cookieValueLenientBase64Encoder('";"'); // => "Ow=="
```

**cookieValueLenientBase64urlEncoder**

Applies [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) encoding to a cookie value if any of its characters fall outside the allowable set defined by the `lenient-cookie-value`.

- **Use Case**: More appropriate for modern tooling. Useful when producing encoded value with URL and Filename Safe Alphabet, and leniency in cookie values is acceptable.
-

```js
import { cookieValueLenientBase64urlEncoder } from '@swaggerexpert/cookie';

cookieValueLenientBase64urlEncoder(';'); // => Ow
cookieValueLenientBase64urlEncoder('";"'); // => "Ow"
```

**cookieValueLenientPercentEncoder**

Percent-encodes characters that fall outside the allowable set defined by the `lenient-cookie-value` rule.
This allows for a more permissive interpretation of cookie values.

- **Use Case**: Useful when broader compatibility is needed, and when leniency in cookie values is acceptable.

```js
import { cookieValueLenientPercentEncoder } from '@swaggerexpert/cookie';

cookieValueLenientPercentEncoder('"'); // => '"'
```

#### Decoders

Decoders are the counterpart of [encoders](#encoders), designed to recover original cookie names and values during **parsing**.
They can be provided to the `parseCookie` function via `decoders` option and are applied to the cookie names and values
of the [AST](#translators). By default, no decoding is performed and cookie names and values are returned as they appear in the cookie string.

```js
import { parseCookie, cookieNamePercentDecoder, cookieValueBase64urlDecoder } from '@swaggerexpert/cookie';

const { tree } = parseCookie('foo%20bar=Ow', {
  decoders: {
    name: cookieNamePercentDecoder,
    value: cookieValueBase64urlDecoder,
  },
});
// tree.pairs => [{ type: 'CookiePair', name: 'foo bar', value: ';' }]
```

When a custom translator is used, decoders are provided to the `ASTTranslator` directly:

```js
import { parseCookie, ASTTranslator, cookieValueBase64urlDecoder } from '@swaggerexpert/cookie';

const translator = new ASTTranslator({ decoders: { value: cookieValueBase64urlDecoder } });
const { tree } = parseCookie('foo=Ow', { translator });
```

Decoders throw `TypeError` if the input is not properly encoded (invalid alphabet, non-canonical encoding or invalid UTF-8),
which results in `CookieParseError` being thrown from the `parseCookie` function.

##### Generic Decoders

- **base64Decoder** - decodes base64 encoded string into UTF-8 string
- **base64urlDecoder** - decodes base64url encoded string into UTF-8 string

##### Cookie Name Decoders

- **cookieNamePercentDecoder** - decodes percent-encoded cookie name, reverses `cookieNameStrictPercentEncoder` and `cookieNameLenientPercentEncoder`

##### Cookie Value Decoders

Cookie value decoders preserve the enclosing DQUOTEs, the same way cookie value encoders do.

- **cookieValuePercentDecoder** - reverses `cookieValueStrictPercentEncoder` and `cookieValueLenientPercentEncoder`
- **cookieValueBase64Decoder** - reverses `cookieValueStrictBase64Encoder` and `cookieValueLenientBase64Encoder`
- **cookieValueBase64urlDecoder** - reverses `cookieValueStrictBase64urlEncoder` and `cookieValueLenientBase64urlEncoder`
- **cookieValueRotatingDecoder** - tries base64url, base64 and percent decoders in this order and returns result of the first one that succeeds; never throws

Encoding of a cookie value is not part of the cookie string, and the encoders leave values that are already valid untouched.
When the encoding is unknown, **cookieValueRotatingDecoder** can be used to detect it on a best-effort basis.
Results of the decoders that are not canonically encoded, not valid UTF-8 or contain control characters are rejected,
so plain values like `bar`, `en` or `admin` are kept as they are.

```js
import { cookieValueRotatingDecoder } from '@swaggerexpert/cookie';

cookieValueRotatingDecoder('aMOpbGxv'); // => 'héllo' (base64url)
cookieValueRotatingDecoder('hello%20world'); // => 'hello world' (percent-encoding)
cookieValueRotatingDecoder('en'); // => 'en' (plain value)
```

> NOTE: detection is inherently ambiguous: `Ow` is both a valid plain value and base64url encoded `;`,
> and `cookieValueRotatingDecoder('Ow')` returns `;`. Prefer explicit decoders when the encoding is known.

Custom order of decoders can be provided using **createCookieValueRotatingDecoder** function:

```js
import {
  createCookieValueRotatingDecoder,
  cookieValuePercentDecoder,
  cookieValueBase64urlDecoder,
} from '@swaggerexpert/cookie';

const decoder = createCookieValueRotatingDecoder([cookieValuePercentDecoder, cookieValueBase64urlDecoder]);

decoder('Ow'); // => 'Ow'
```

#### Validators

The `@swaggerexpert/cookie` library provides a suite of validators designed to ensure that cookie names and values
comply with the necessary standards during **serialization**. These validators are strict about adherence to the rules
while offering flexibility with both strict and lenient validation modes. Validators focus on validating input and
throwing descriptive errors for invalid values.

##### Cookie Name Validators

**cookieNameStrictValidator**

Validates cookie names based on the `cookie-name` rule defined in [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).

```js
import { cookieNameStrictValidator } from '@swaggerexpert/cookie';

cookieNameStrictValidator('ValidName'); // passes
cookieNameStrictValidator('InvalidName<'); // throws: Invalid cookie name
```


**cookieNameLenientValidator**

Validates cookie names based on the `lenient-cookie-name` rules Allows a broader range of characters than the strict validator.

```js
import { cookieNameLenientValidator } from '@swaggerexpert/cookie';

cookieNameLenientValidator('ValidLenientName'); // passes
cookieNameLenientValidator('\tInvalidLenientName'); // throws: Invalid cookie name
```

##### Cookie Value Validators

**cookieValueStrictValidator**

Validates cookie values according to the `cookie-value` rules in [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1).

```js
import { cookieValueStrictValidator } from '@swaggerexpert/cookie';

cookieValueStrictValidator('"validValue"'); // passes
cookieValueStrictValidator('invalid\\value'); // throws: Invalid cookie value
```

**cookieValueLenientValidator**

Validates cookie values according to `lenient-cookie-value` rules. Accepts a broader range of characters,
including some that are disallowed in strict mode.

```js
import { cookieValueLenientValidator } from '@swaggerexpert/cookie';

cookieValueLenientValidator('"lenient;value"'); // passes
cookieValueLenientValidator('invalid value'); // throws: Invalid cookie value
```

#### Errors

`@swaggerexpert/cookie` provides a structured error class hierarchy,
enabling precise error handling.

```js
import { CookieError, CookieParseError } from '@swaggerexpert/cookie';
```

**CookieError** is the base class for all errors. **CookieParseError** is thrown when parsing fails unexpectedly
and includes additional context about the cookie string that failed to parse.
Passing a non-string value to the `parseCookie` function throws a `TypeError`.

```js
import { parseCookie, CookieParseError } from '@swaggerexpert/cookie';

try {
  parseCookie('foo=bar');
} catch (error) {
  if (error instanceof CookieParseError) {
    console.log(error.cookieString); // the cookie string that failed to parse
  }
}
```

#### Grammar

New grammar instance can be created in following way:

```js
import { Grammar } from '@swaggerexpert/cookie';

const grammar = new Grammar();
```

To obtain original ABNF (SABNF) grammar as a string:

```js
import { Grammar } from '@swaggerexpert/cookie';

const grammar = new Grammar();

grammar.toString();
// or
String(grammar);
```

## More about RFC 6265

The cookie is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax

```abnf
; Lenient version of https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.1
lenient-cookie-string        = lenient-cookie-entry *( ";" OWS lenient-cookie-entry )
lenient-cookie-entry         = lenient-cookie-pair / lenient-cookie-pair-invalid
lenient-cookie-pair          = OWS lenient-cookie-name OWS "=" OWS lenient-cookie-value OWS
lenient-cookie-pair-invalid  = OWS 1*tchar OWS ; Allow for standalone entries like "fizz" to be ignored
lenient-cookie-name          = 1*( %x21-3A / %x3C / %x3E-7E ) ; Allow all printable US-ASCII except "="
lenient-cookie-value         = lenient-quoted-value [ *lenient-cookie-octet ] / *lenient-cookie-octet
lenient-quoted-value         = DQUOTE *( lenient-quoted-char ) DQUOTE
lenient-quoted-char          = %x20-21 / %x23-7E ; Allow all printable US-ASCII except DQUOTE
lenient-cookie-octet         = %x21-2B / %x2D-3A / %x3C-7E
                             ; Allow all printable characters except CTLs, semicolon and SP

; Lenient version of https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1
; following parsing algorithm of https://datatracker.ietf.org/doc/html/rfc6265#section-5.2
lenient-set-cookie-string    = lenient-set-cookie-pair *( ";" lenient-cookie-av )
lenient-set-cookie-pair      = *WSP lenient-set-cookie-name *WSP "=" *WSP lenient-set-cookie-value *WSP
lenient-set-cookie-name      = lenient-name-char *( *WSP lenient-name-char ) ; leading and trailing WSP is not part of the name
lenient-set-cookie-value     = [ lenient-value-char *( *WSP lenient-value-char ) ] ; leading and trailing WSP is not part of the value
lenient-cookie-av            = *WSP lenient-cookie-av-name *WSP [ "=" *WSP lenient-cookie-av-value *WSP ]
lenient-cookie-av-name       = [ lenient-name-char *( *WSP lenient-name-char ) ]
lenient-cookie-av-value      = [ lenient-value-char *( *WSP lenient-value-char ) ]
; CTLs (except HTAB) are not allowed, as they are not allowed in HTTP field values (https://www.rfc-editor.org/rfc/rfc9110#section-5.5)
lenient-name-char            = %x21-3A / %x3C / %x3E-7E / %x80-10FFFF ; any CHAR except CTLs, WSP, ";" and "="
lenient-value-char           = %x21-3A / %x3C-7E / %x80-10FFFF ; any CHAR except CTLs, WSP and ";"

; https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.1
cookie-string     = cookie-pair *( ";" SP cookie-pair )

; https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1
; https://www.rfc-editor.org/errata/eid5518
cookie-pair       = cookie-name "=" cookie-value
cookie-name       = token
cookie-value      = ( DQUOTE *cookie-octet DQUOTE ) / *cookie-octet
                  ; https://www.rfc-editor.org/errata/eid8242
cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
                       ; US-ASCII characters excluding CTLs,
                       ; whitespace, DQUOTE, comma, semicolon,
                       ; and backslash

; https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1
set-cookie-string = cookie-pair *( ";" SP cookie-av )
cookie-av         = extension-av
                  ; MODIFICATION: originally
                  ; cookie-av = expires-av / max-age-av / domain-av /
                  ;             path-av / secure-av / httponly-av /
                  ;             extension-av
                  ; All the alternatives are subsets of extension-av. Parsers processing alternatives
                  ; left-to-right without backtracking would commit to a partial match of a specific
                  ; alternative (e.g. "Secure " or "Max-Age=60 ") and fail, instead of matching extension-av.
expires-av        = "Expires=" sane-cookie-date
sane-cookie-date  = rfc1123-date
                      ; defined in [RFC2616], Section 3.3.1
max-age-av        = "Max-Age=" non-zero-digit *DIGIT
                      ; In practice, both expires-av and max-age-av
                      ; are limited to dates representable by the
                      ; user agent.
non-zero-digit    = %x31-39
                      ; digits 1 through 9
domain-av         = "Domain=" domain-value
domain-value      = subdomain
                      ; defined in [RFC1034], Section 3.5, as
                      ; enhanced by [RFC1123], Section 2.1
path-av           = "Path=" path-value
path-value        = *av-octet
                  ; https://www.rfc-editor.org/errata/eid3444
secure-av         = "Secure"
httponly-av       = "HttpOnly"
extension-av      = *av-octet
                  ; https://www.rfc-editor.org/errata/eid3444
av-octet          = %x20-3A / %x3C-7E
                      ; any CHAR except CTLs or ";"

; https://datatracker.ietf.org/doc/html/rfc1034#section-3.5
; https://datatracker.ietf.org/doc/html/rfc1123#section-2.1
subdomain         = label *( "." label )
label             = let-dig *( *"-" let-dig )
                  ; MODIFICATION: originally
                  ; <label> ::= <letter> [ [ <ldh-str> ] <let-dig> ]
                  ; <ldh-str> ::= <let-dig-hyp> | <let-dig-hyp> <ldh-str>
                  ; <let-dig-hyp> ::= <let-dig> | "-"
                  ; RFC 1123 allows the first character to be either a letter or a digit.
                  ; Rewritten as an equivalent grammar, as greedy repetition doesn't backtrack.
let-dig           = ALPHA / DIGIT

; https://datatracker.ietf.org/doc/html/rfc2616#section-3.3.1
; HTTP-date is case sensitive
rfc1123-date      = wkday "," SP date1 SP time SP %s"GMT"
date1             = 2DIGIT SP month SP 4DIGIT
                  ; day month year (e.g., 02 Jun 1982)
time              = 2DIGIT ":" 2DIGIT ":" 2DIGIT
                  ; 00:00:00 - 23:59:59
wkday             = %s"Mon" / %s"Tue" / %s"Wed"
                  / %s"Thu" / %s"Fri" / %s"Sat" / %s"Sun"
month             = %s"Jan" / %s"Feb" / %s"Mar" / %s"Apr"
                  / %s"May" / %s"Jun" / %s"Jul" / %s"Aug"
                  / %s"Sep" / %s"Oct" / %s"Nov" / %s"Dec"

; https://datatracker.ietf.org/doc/html/rfc6265#section-2.2
OWS            = *( [ CRLF ] WSP ) ; "optional" whitespace

; https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.2
token          = 1*(tchar)
tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
                 / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
                 / DIGIT / ALPHA
                 ; any VCHAR, except delimiters

; https://datatracker.ietf.org/doc/html/rfc2616#section-2.2
CHAR           = %x01-7F ; any US-ASCII character (octets 0 - 127)
CTL            = %x00-1F / %x7F ; any US-ASCII control character
separators     = "(" / ")" / "<" / ">" / "@" / "," / ";" / ":" / "\" / %x22 / "/" / "[" / "]" / "?" / "=" / "{" / "}" / SP / HT
SP             = %x20 ; US-ASCII SP, space (32)
HT             = %x09 ; US-ASCII HT, horizontal-tab (9)

; https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1
ALPHA          =  %x41-5A / %x61-7A ; A-Z / a-z
DIGIT          =  %x30-39 ; 0-9
DQUOTE         =  %x22 ; " (Double Quote)
WSP            =  SP / HTAB ; white space
HTAB           =  %x09 ; horizontal tab
CRLF           =  CR LF ; Internet standard newline
CR             =  %x0D ; carriage return
LF             =  %x0A ; linefeed
```

## License

`@swaggerexpert/cookie` is licensed under [Apache 2.0 license](https://github.com/swaggerexpert/cookie/blob/main/LICENSE).
`@swaggerexpert/cookie` comes with an explicit [NOTICE](https://github.com/swaggerexpert/cookie/blob/main/NOTICE) file
containing additional legal notices and information.
