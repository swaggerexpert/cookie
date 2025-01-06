import { assert } from 'chai';

import { parseCookie } from '../../src/index.js';

describe('parseCookie', function () {
  context('given valid cookie string', function () {
    context('single cookie pair #1', function () {
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

    context('single cookie pair #2', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('foo=123');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo=123'],
          ['cookie-pair', 'foo=123'],
          ['cookie-name', 'foo'],
          ['cookie-value', '123'],
        ]);
      });
    });

    context('single cookie pair with quotes', function () {
      specify('should parse and translate', function () {
        const parseResult = parseCookie('foo="123"');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo="123"'],
          ['cookie-pair', 'foo="123"'],
          ['cookie-name', 'foo'],
          ['cookie-value', '"123"'],
        ]);
      });
    });

    context('cookie with whitespaces', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('FOO    = bar;   baz  =   raz');

        assert.isFalse(parseResult.result.success);
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

    context('cookie with invalid characters in name', function () {
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

    context('percent encoded cookie value #1', function () {
      specify('should fail parsing', function () {
        const parseResult = parseCookie('foo="bar=123456789&name=Magic+Mouse"');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo="bar=123456789&name=Magic+Mouse"'],
          ['cookie-pair', 'foo="bar=123456789&name=Magic+Mouse"'],
          ['cookie-name', 'foo'],
          ['cookie-value', '"bar=123456789&name=Magic+Mouse"'],
        ]);
      });
    });

    context('percent encoded cookie value #2  ', function () {
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

    context('damaged escaping', function () {
      specify('should parse all and translate', function () {
        const parseResult = parseCookie('foo=%1; bar=bar');

        const parts = [];
        parseResult.ast.translate(parts);

        assert.isTrue(parseResult.result.success);
        assert.deepEqual(parts, [
          ['cookie-string', 'foo=%1; bar=bar'],
          ['cookie-pair', 'foo=%1'],
          ['cookie-name', 'foo'],
          ['cookie-value', '%1'],
          ['cookie-pair', 'bar=bar'],
          ['cookie-name', 'bar'],
          ['cookie-value', 'bar'],
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

  context('cookie with no separator space', function () {
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

  context('non-string values', function () {
    specify('should throw or fail parsing', function () {
      assert.throws(() => parseCookie(1));
      assert.throws(() => parseCookie(null));
      assert.throws(() => parseCookie(undefined));
      assert.throws(() => parseCookie({}));

      assert.isFalse(parseCookie([]).result.success); // Iterable
    });
  });
});

context('parseCookie in lenient mode', function () {
  context('single cookie pair #1', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo=bar', { strict: false });

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

  context('single cookie pair #2', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo=123', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo=123'],
        ['cookie-pair', 'foo=123'],
        ['cookie-name', 'foo'],
        ['cookie-value', '123'],
      ]);
    });
  });

  context('cookie with OWS', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('FOO    = bar;   baz  =   raz', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'FOO    = bar;   baz  =   raz'],
        ['cookie-pair', 'FOO    = bar'],
        ['cookie-name', 'FOO'],
        ['cookie-value', 'bar'],
        ['cookie-pair', 'baz  =   raz'],
        ['cookie-name', 'baz'],
        ['cookie-value', 'raz'],
      ]);
    });
  });

  context('multiple cookie pairs', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo1=bar1; foo2=123', { strict: false });

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
      const parseResult = parseCookie('foo=; bar=', { strict: false });

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
      const parseResult = parseCookie('f=', { strict: false });

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
      const parseResult = parseCookie('f=; b=', { strict: false });

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

  context('percent encoded cookie value #1', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo="bar=123456789&name=Magic+Mouse"', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo="bar=123456789&name=Magic+Mouse"'],
        ['cookie-pair', 'foo="bar=123456789&name=Magic+Mouse"'],
        ['cookie-name', 'foo'],
        ['cookie-value', '"bar=123456789&name=Magic+Mouse"'],
      ]);
    });
  });

  context('percent encoded cookie value #2  ', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('email=%20%22%2c%3b%2f', { strict: false });

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

  context('cookie with whitespaces around key and value #1', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('  foo  =  "bar"  ', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', '  foo  =  "bar"  '],
        ['cookie-pair', '  foo  =  "bar"  '],
        ['cookie-name', 'foo'],
        ['cookie-value', '"bar"'],
      ]);
    });
  });

  context('cookie with whitespaces around key and value #2', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie(' foo  =  bar  ;  fizz  =  buzz  ', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', ' foo  =  bar  ;  fizz  =  buzz  '],
        ['cookie-pair', ' foo  =  bar  '],
        ['cookie-name', 'foo'],
        ['cookie-value', 'bar'],
        ['cookie-pair', 'fizz  =  buzz  '],
        ['cookie-name', 'fizz'],
        ['cookie-value', 'buzz'],
      ]);
    });
  });

  context('cookie with whitespaces around key and value #3', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie(' foo = ', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', ' foo = '],
        ['cookie-pair', ' foo = '],
        ['cookie-name', 'foo'],
        ['cookie-value', ''],
      ]);
    });
  });

  context('cookie with whitespaces around key and value #4', function () {
    specify('should fail parsing', function () {
      const parseResult1 = parseCookie(' = bar ', { strict: false });
      const parseResult2 = parseCookie('   =   ', { strict: false });

      assert.isFalse(parseResult1.result.success);
      assert.isFalse(parseResult2.result.success);
    });
  });

  context('cookie with whitespaces around key and value #5', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('\tfoo\t=\tbar\t', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', '\tfoo\t=\tbar\t'],
        ['cookie-pair', '\tfoo\t=\tbar\t'],
        ['cookie-name', 'foo'],
        ['cookie-value', 'bar'],
      ]);
    });
  });

  context('damaged escaping', function () {
    specify('should parse all and translate', function () {
      const parseResult = parseCookie('foo=%1; bar=bar', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo=%1; bar=bar'],
        ['cookie-pair', 'foo=%1'],
        ['cookie-name', 'foo'],
        ['cookie-value', '%1'],
        ['cookie-pair', 'bar=bar'],
        ['cookie-name', 'bar'],
        ['cookie-value', 'bar'],
      ]);
    });
  });

  context('duplicate cookies', function () {
    specify('should parse all and translate', function () {
      const parseResult = parseCookie('foo=%1; bar=bar; foo=boo', { strict: false });

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

  context('ambiguous equal sign', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('name=name=3', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'name=name=3'],
        ['cookie-pair', 'name=name=3'],
        ['cookie-name', 'name'],
        ['cookie-value', 'name=3'],
      ]);
    });
  });

  context('special characters #1', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('name:name=3', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'name:name=3'],
        ['cookie-pair', 'name:name=3'],
        ['cookie-name', 'name:name'],
        ['cookie-value', '3'],
      ]);
    });
  });

  context('native properties', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('toString=foo; valueOf=bar', { strict: false });

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

  context('cookie with no separator space', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo1=bar;foo2=baz', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo1=bar;foo2=baz'],
        ['cookie-pair', 'foo1=bar'],
        ['cookie-name', 'foo1'],
        ['cookie-value', 'bar'],
        ['cookie-pair', 'foo2=baz'],
        ['cookie-name', 'foo2'],
        ['cookie-value', 'baz'],
      ]);
    });
  });

  context('cookie with multiple separators', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo1=bar;  foo2=baz', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo1=bar;  foo2=baz'],
        ['cookie-pair', 'foo1=bar'],
        ['cookie-name', 'foo1'],
        ['cookie-value', 'bar'],
        ['cookie-pair', 'foo2=baz'],
        ['cookie-name', 'foo2'],
        ['cookie-value', 'baz'],
      ]);
    });
  });

  context('cookie with empty name', function () {
    specify('should fail parsing', function () {
      const parseResult = parseCookie('=value', { strict: false });

      assert.isFalse(parseResult.result.success);
    });
  });

  context('cookies without value #1', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo=bar; fizz; buzz', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo=bar; fizz; buzz'],
        ['cookie-pair', 'foo=bar'],
        ['cookie-name', 'foo'],
        ['cookie-value', 'bar'],
      ]);
    });
  });

  context('cookies without value #2', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('fizz; buzz; foo=bar', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'fizz; buzz; foo=bar'],
        ['cookie-pair', 'foo=bar'],
        ['cookie-name', 'foo'],
        ['cookie-value', 'bar'],
      ]);
    });
  });

  context('cookie with semicolon in quoted value', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo1="bar;baz"', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo1="bar;baz"'],
        ['cookie-pair', 'foo1="bar;baz"'],
        ['cookie-name', 'foo1'],
        ['cookie-value', '"bar;baz"'],
      ]);
    });
  });

  context('cookie with quote in quoted value', function () {
    specify('should parse and translate', function () {
      const parseResult = parseCookie('foo="bar"baz"', { strict: false });

      const parts = [];
      parseResult.ast.translate(parts);

      assert.isTrue(parseResult.result.success);
      assert.deepEqual(parts, [
        ['cookie-string', 'foo="bar"baz"'],
        ['cookie-pair', 'foo="bar"baz"'],
        ['cookie-name', 'foo'],
        ['cookie-value', '"bar"baz"'],
      ]);
    });
  });

  context('non-string values', function () {
    specify('should throw or fail parsing', function () {
      assert.throws(() => parseCookie(1));
      assert.throws(() => parseCookie(null));
      assert.throws(() => parseCookie(undefined));
      assert.throws(() => parseCookie({}));

      assert.isFalse(parseCookie([]).result.success); // Iterable
    });
  });
});
