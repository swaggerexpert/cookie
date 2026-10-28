import { assert } from 'chai';

import {
  serializeSetCookie,
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
});
