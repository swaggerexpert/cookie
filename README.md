# cookie

[![npmversion](https://badge.fury.io/js/@swaggerexpert%2Fcookie.svg)](https://www.npmjs.com/package/@swaggerexpert/cookie)
[![npm](https://img.shields.io/npm/dm/@swaggerexpert/cookie)](https://www.npmjs.com/package/@swaggerexpert/cookie)
[![Test workflow](https://github.com/swaggerexpert/cookie/actions/workflows/test.yml/badge.svg)](https://github.com/swaggerexpert/cookie/actions)
[![Dependabot enabled](https://img.shields.io/badge/Dependabot-enabled-blue.svg)](https://dependabot.com/)
[![try on RunKit](https://img.shields.io/badge/try%20on-RunKit-brightgreen.svg?style=flat)](https://npm.runkit.com/@swaggerexpert/cookie)
[![Tidelift](https://tidelift.com/badges/package/npm/@swaggerexpert%2Fcookie)](https://tidelift.com/subscription/pkg/npm-.swaggerexpert-cookie?utm_source=npm-swaggerexpert-cookie&utm_medium=referral&utm_campaign=readme)

`@swaggerexpert/cookie` is [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265) compliant cookie `parser`.

<table>
  <tr>
    <td align="right" valign="middle">
        <img src="https://cdn2.hubspot.net/hubfs/4008838/website/logos/logos_for_download/Tidelift_primary-shorthand-logo.png" alt="Tidelift" width="60" />
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
    - [Parsing cookie](#parsing-cookie)
    - [Grammar](#grammar)
- [More about RFC 6265](#more-about-rfc-6265)
- [License](#license)

## Getting started

### Installation

You can install `@swaggerexpert/cookie` using `npm`:

```sh
 $ npm install @swaggerexpert/cookie
```

### Usage

`@swaggerexpert/cookie` currently supports **parsing**.
Parser is based on a superset of [ABNF](https://www.rfc-editor.org/rfc/rfc5234) ([SABNF](https://cs.github.com/ldthomas/apg-js2/blob/master/SABNF.md))
and uses [apg-lite](https://github.com/ldthomas/apg-lite) parser generator.

#### Parsing cookie

Parsing a cookie is as simple as importing the **parseCookie** function
and calling it.

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

**ParseResult** returned by the parser has the following shape:

```
{
  result: {
    success: true,
    state: 101,
    stateName: 'MATCH',
    length: 7,
    matched: 7,
    maxMatched: 7,
    maxTreeDepth: 9,
    nodeHits: 71
  },
  ast: fnast {
    callbacks: [
      'cookie-string': [Function: cookieString],
      'cookie-pair': [Function: cookiePair],
      'cookie-name': [Function: cookieName],
      'cookie-value': [Function: cookieValue]
    ],
    init: [Function (anonymous)],
    ruleDefined: [Function (anonymous)],
    udtDefined: [Function (anonymous)],
    down: [Function (anonymous)],
    up: [Function (anonymous)],
    translate: [Function (anonymous)],
    setLength: [Function (anonymous)],
    getLength: [Function (anonymous)],
    toXml: [Function (anonymous)]
  }
}
```

###### Interpreting AST as list of entries

```js
import { parseCookie } from '@swaggerexpert/cookie';

const parseResult = parse('foo=bar');
const parts = [];

parseResult.ast.translate(parts);
```

After running the above code, **parts** variable has the following shape:

```js
[
  ['cookie-string', 'foo=bar'],
  ['cookie-pair', 'foo=bar'],
  ['cookie-name', 'foo'],
  ['cookie-value', 'bar'],
]
```

###### Interpreting AST as XML

```js
import { parseCookie } from '@swaggerexpert/cookie';

const parseResult = parseCookie('foo=bar');
const xml = parseResult.ast.toXml();
```

After running the above code, **xml** variable has the following content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<root nodes="4" characters="7">
  <!-- input string -->
  foo=bar
  <node name="cookie-string" index="0" length="7">
    foo=bar
    <node name="cookie-pair" index="0" length="7">
      foo=bar
      <node name="cookie-name" index="0" length="3">
        foo
      </node><!-- name="cookie-name" -->
      <node name="cookie-value" index="4" length="3">
        bar
      </node><!-- name="cookie-value" -->
    </node><!-- name="cookie-pair" -->
  </node><!-- name="cookie-string" -->
</root>
```

> NOTE: AST can also be traversed in classical way using [depth first traversal](https://www.tutorialspoint.com/data_structures_algorithms/depth_first_traversal.htm). For more information about this option please refer to [apg-js](https://github.com/ldthomas/apg-js) and [apg-js-examples](https://github.com/ldthomas/apg-js-examples).


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
lenient-cookie-value         = lenient-quoted-value / *lenient-cookie-octet
lenient-quoted-value         = DQUOTE *( %x20-21 / %x23-7E ) DQUOTE ; Allow all printable US-ASCII except DQUOTE
lenient-cookie-octet         = %x20-2B / %x2D-3A / %x3C-7E
                             ; Allow all printable characters except control chars and DQUOTE, except for semicolon

; https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.1
; https://www.rfc-editor.org/errata/eid5518
cookie-string     = cookie-pair *( ";" SP cookie-pair )
cookie-pair       = cookie-name "=" cookie-value
cookie-name       = token
cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
                       ; US-ASCII characters excluding CTLs,
                       ; whitespace DQUOTE, comma, semicolon,
                       ; and backslash

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
