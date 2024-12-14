import { assert } from 'chai';

import { parseCookie } from '../../src/index.js';

describe('parseCookie', function () {
  context('given valid cookie string', function () {
    context('single cookie pair', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('foo=bar');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo=bar'],
          ['cookie-pair', 'foo=bar'],
          ['cookie-name', 'foo'],
          ['cookie-value', 'bar'],
        ]);
      });
    });

    context('multiple cookie pairs', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('foo1=bar1; foo2=123');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo1=bar1; foo2=123'],
          ['cookie-pair', 'foo1=bar1'],
          ['cookie-name', 'foo1'],
          ['cookie-value', 'bar1'],
          ['cookie-pair', 'foo2=123'],
          ['cookie-name', 'foo2'],
          ['cookie-value', '123'],
        ]);
      });
    });

    context('cookie with empty value', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('foo=; bar=');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo=; bar='],
          ['cookie-pair', 'foo='],
          ['cookie-name', 'foo'],
          ['cookie-value', ''],
          ['cookie-pair', 'bar='],
          ['cookie-name', 'bar'],
          ['cookie-value', ''],
        ]);
      });
    });

    context('cookie with minimum length #1', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('f=');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'f='],
          ['cookie-pair', 'f='],
          ['cookie-name', 'f'],
          ['cookie-value', ''],
        ]);
      });
    });

    context('cookie with minimum length #2', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('f=; b=');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'f=; b='],
          ['cookie-pair', 'f='],
          ['cookie-name', 'f'],
          ['cookie-value', ''],
          ['cookie-pair', 'b='],
          ['cookie-name', 'b'],
          ['cookie-value', ''],
        ]);
      });
    });

    context('percent encoded cookie value', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('email=%20%22%2c%3b%2f');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'email=%20%22%2c%3b%2f'],
          ['cookie-pair', 'email=%20%22%2c%3b%2f'],
          ['cookie-name', 'email'],
          ['cookie-value', '%20%22%2c%3b%2f'],
        ]);
      });
    });

    context('duplicate cookies', function () {
      specify('should parse all and translate', function () {
        const parseResult = parseCookie('foo=%1; bar=bar; foo=boo');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo=%1; bar=bar; foo=boo'],
          ['cookie-pair', 'foo=%1'],
          ['cookie-name', 'foo'],
          ['cookie-value', '%1'],
          ['cookie-pair', 'bar=bar'],
          ['cookie-name', 'bar'],
          ['cookie-value', 'bar'],
          ['cookie-pair', 'foo=boo'],
          ['cookie-name', 'foo'],
          ['cookie-value', 'boo'],
        ]);
      });
    });

    context('native properties', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('toString=foo; valueOf=bar');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'toString=foo; valueOf=bar'],
          ['cookie-pair', 'toString=foo'],
          ['cookie-name', 'toString'],
          ['cookie-value', 'foo'],
          ['cookie-pair', 'valueOf=bar'],
          ['cookie-name', 'valueOf'],
          ['cookie-value', 'bar'],
        ]);
      });
    });
  });

  context('given invalid cookie string', function () {
    context('cookie with whitespaces', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('FOO    = bar');

        assert.isFalse(parseResult.result.success);
      });
    });

    context('cookie with whitespaces around key and value', function () {
      specify('should fail parsing', function () {
        const parseResult1 = parseCookie('  foo  =  "bar"  ');
        const parseResult2 = parseCookie('  foo  =  bar  ;  fizz  =  buzz  ');
        const parseResult3 = parseCookie(' = bar ');
        const parseResult4 = parseCookie(' foo = ');
        const parseResult5 = parseCookie('   =   ');
        const parseResult6 = parseCookie('\tfoo\t=\tbar\t');

        assert.isFalse(parseResult1.result.success);
        assert.isFalse(parseResult2.result.success);
        assert.isFalse(parseResult3.result.success);
        assert.isFalse(parseResult4.result.success);
        assert.isFalse(parseResult5.result.success);
        assert.isFalse(parseResult6.result.success);
      });
    });

    context('cookie with no separator', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('foo1=bar;foo2=baz');

        assert.isFalse(parseResult.result.success);
      });
    });

    context('cookie with multiple separators', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('foo1=bar;  foo2=baz');

        assert.isFalse(parseResult.result.success);
      });
    });

    context('percent encoded cookie value', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('foo="bar=123456789&name=Magic+Mouse"');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isFalse(parseResult.result.success);
      });
    });

    context('cookie with empty name', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('=value');

        assert.isFalse(parseResult.result.success);
      });
    });

    context('cookies without value', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('foo=bar; fizz; buzz');

        assert.isFalse(parseResult.result.success);
      });
    });
  });
});