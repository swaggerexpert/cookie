import vm from 'node:vm';
import { assert } from 'chai';

import {
  serializeSetCookie,
  serializeCookie,
  cookieValueLenientPercentEncoder,
  cookieNameStrictValidator,
  identity,
  noop,
} from '../../src/index.js';

describe('serializeSetCookie', function () {
  it('should serialize cookie pair', function () {
    assert.strictEqual(serializeSetCookie('foo', 'bar'), 'foo=bar');
    assert.strictEqual(serializeSetCookie('foo', ''), 'foo=');
    assert.strictEqual(serializeSetCookie('foo', ';'), 'foo=Ow'); // base64url encoding
  });

  it('should validate cookie name', function () {
    assert.throws(() => serializeSetCookie('fo o', 'bar'), TypeError);
  });

  it('should allow custom encoders', function () {
    assert.strictEqual(
      serializeSetCookie('foo', 'b r', { encoders: { value: cookieValueLenientPercentEncoder } }),
      'foo=b%20r',
    );
  });

  it('should allow custom validators', function () {
    assert.throws(
      () =>
        serializeSetCookie('fo o', 'bar', {
          encoders: { name: identity },
          validators: { name: cookieNameStrictValidator },
        }),
      TypeError,
    );
  });

  it('should allow bypassing encoding and validation', function () {
    assert.strictEqual(
      serializeSetCookie('foo', ';', {
        encoders: { name: identity, value: identity },
        validators: { name: noop, value: noop },
      }),
      'foo=;',
    );
  });

  context('attributes', function () {
    const expires = new Date(Date.UTC(2027, 9, 21, 7, 28));

    it('should serialize all attributes', function () {
      assert.strictEqual(
        serializeSetCookie('id', 'a3fWa', {
          expires,
          maxAge: 3600,
          domain: 'example.com',
          path: '/docs',
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
          partitioned: true,
          priority: 'high',
        }),
        'id=a3fWa; Expires=Thu, 21 Oct 2027 07:28:00 GMT; Max-Age=3600; Domain=example.com; Path=/docs; Secure; HttpOnly; SameSite=Lax; Partitioned; Priority=High',
      );
    });

    it('should omit undefined and false attributes', function () {
      assert.strictEqual(
        serializeSetCookie('a', 'b', {
          expires: undefined,
          secure: false,
          httpOnly: false,
          partitioned: false,
        }),
        'a=b',
      );
    });

    context('expires', function () {
      it('should serialize Date as rfc1123-date', function () {
        assert.strictEqual(
          serializeSetCookie('a', 'b', { expires: new Date(0) }),
          'a=b; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        );
      });

      it('should serialize Date from other realm', function () {
        const date = vm.runInNewContext('new Date(0)');

        assert.isFalse(date instanceof Date);
        assert.strictEqual(
          serializeSetCookie('a', 'b', { expires: date }),
          'a=b; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        );
      });

      it('should throw on invalid date', function () {
        assert.throws(() => serializeSetCookie('a', 'b', { expires: new Date('x') }), TypeError);
        assert.throws(
          () => serializeSetCookie('a', 'b', { expires: 'Thu, 01 Jan 1970' }),
          TypeError,
        );
        assert.throws(() => serializeSetCookie('a', 'b', { expires: 0 }), TypeError);
      });
    });

    context('maxAge', function () {
      it('should serialize integers', function () {
        assert.strictEqual(serializeSetCookie('a', 'b', { maxAge: 60 }), 'a=b; Max-Age=60');
        assert.strictEqual(serializeSetCookie('a', 'b', { maxAge: 0 }), 'a=b; Max-Age=0');
        assert.strictEqual(serializeSetCookie('a', 'b', { maxAge: -1 }), 'a=b; Max-Age=-1');
      });

      it('should throw on non-integers', function () {
        assert.throws(() => serializeSetCookie('a', 'b', { maxAge: 1.5 }), TypeError);
        assert.throws(() => serializeSetCookie('a', 'b', { maxAge: '60' }), TypeError);
        assert.throws(() => serializeSetCookie('a', 'b', { maxAge: Infinity }), TypeError);
        assert.throws(() => serializeSetCookie('a', 'b', { maxAge: NaN }), TypeError);
        assert.throws(() => serializeSetCookie('a', 'b', { maxAge: 1e23 }), TypeError);
      });
    });

    context('domain', function () {
      it('should serialize valid subdomains', function () {
        [
          'example.com',
          'sub.example.com',
          '1st.example',
          'a--b.com',
          'xn--bcher-kva.example',
        ].forEach((domain) => {
          assert.strictEqual(serializeSetCookie('a', 'b', { domain }), `a=b; Domain=${domain}`);
        });
      });

      it('should tolerate leading dot', function () {
        assert.strictEqual(
          serializeSetCookie('a', 'b', { domain: '.example.com' }),
          'a=b; Domain=.example.com',
        );
      });

      it('should throw on invalid domain', function () {
        ['', '.', '-bad.com', 'bad-.com', 'a..b', 'ex ample.com', 'bücher.example', 'a;b'].forEach(
          (domain) => {
            assert.throws(() => serializeSetCookie('a', 'b', { domain }), TypeError);
          },
        );
      });
    });

    context('path', function () {
      it('should serialize valid path', function () {
        assert.strictEqual(serializeSetCookie('a', 'b', { path: '/' }), 'a=b; Path=/');
        assert.strictEqual(serializeSetCookie('a', 'b', { path: '/a b' }), 'a=b; Path=/a b');
      });

      it('should throw on invalid path', function () {
        ['/a;b', '/ü', '/a\nb'].forEach((path) => {
          assert.throws(() => serializeSetCookie('a', 'b', { path }), TypeError);
        });
      });
    });

    context('sameSite', function () {
      it('should serialize case-insensitive values', function () {
        assert.strictEqual(
          serializeSetCookie('a', 'b', { sameSite: 'strict' }),
          'a=b; SameSite=Strict',
        );
        assert.strictEqual(serializeSetCookie('a', 'b', { sameSite: 'Lax' }), 'a=b; SameSite=Lax');
        assert.strictEqual(
          serializeSetCookie('a', 'b', { sameSite: 'NONE' }),
          'a=b; SameSite=None',
        );
      });

      it('should throw on invalid value', function () {
        assert.throws(() => serializeSetCookie('a', 'b', { sameSite: 'bogus' }), TypeError);
        assert.throws(() => serializeSetCookie('a', 'b', { sameSite: true }), TypeError);
      });
    });

    context('priority', function () {
      it('should serialize case-insensitive values', function () {
        assert.strictEqual(serializeSetCookie('a', 'b', { priority: 'low' }), 'a=b; Priority=Low');
        assert.strictEqual(
          serializeSetCookie('a', 'b', { priority: 'HIGH' }),
          'a=b; Priority=High',
        );
      });

      it('should throw on invalid value', function () {
        assert.throws(() => serializeSetCookie('a', 'b', { priority: 'urgent' }), TypeError);
      });
    });

    it('should not be serialized into Cookie header', function () {
      assert.strictEqual(
        serializeCookie({ a: 'b' }, { path: '/', secure: true, maxAge: 1 }),
        'a=b',
      );
    });
  });
});
