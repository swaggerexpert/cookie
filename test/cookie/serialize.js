import { assert } from 'chai';

import {
  serializeCookie,
  cookieValueLenientPercentEncoder,
  cookieNameLenientValidator,
  cookieValueLenientValidator,
  identity,
  noop,
} from '../../src/index.js';

describe('serializeCookie', function () {
  it('should serialize object', function () {
    assert.strictEqual(serializeCookie({ foo: 'bar' }), 'foo=bar');
    assert.strictEqual(serializeCookie({ foo: 'bar', baz: 'raz' }), 'foo=bar; baz=raz');
    assert.strictEqual(serializeCookie({}), '');
  });

  it('should serialize entries', function () {
    assert.strictEqual(serializeCookie([['foo', 'bar']]), 'foo=bar');
    assert.strictEqual(
      serializeCookie([
        ['foo', 'bar'],
        ['baz', 'raz'],
      ]),
      'foo=bar; baz=raz',
    );
    assert.strictEqual(
      serializeCookie([
        ['foo', 'bar'],
        ['baz', 'raz'],
        ['foo', 'boo'],
      ]),
      'foo=bar; baz=raz; foo=boo',
    );
    assert.strictEqual(serializeCookie([]), '');
  });

  it('should always return en empty string on invalid input', function () {
    assert.strictEqual(serializeCookie(1), '');
    assert.strictEqual(serializeCookie(null), '');
    assert.strictEqual(serializeCookie(undefined), '');
    assert.strictEqual(serializeCookie(new Date()), '');
    assert.strictEqual(serializeCookie(Symbol.for('foo')), '');
  });

  context('Customizing serialization', function () {
    specify('should allow lenient serialization', function () {
      const cookies = { foo: '"\\' }; // allowed by lenient grammar but not by strict
      const serialized = serializeCookie(cookies, {
        encoders: {
          value: cookieValueLenientPercentEncoder,
        },
        validators: {
          name: cookieNameLenientValidator,
          value: cookieValueLenientValidator,
        },
      });

      assert.strictEqual(serialized, 'foo="\\');
    });

    specify('should allow bypassing encoding and validation', function () {
      const cookies = { foo: ';' }; // allowed by lenient grammar but not by strict
      const serialized = serializeCookie(cookies, {
        encoders: {
          value: identity,
        },
        validators: {
          name: noop,
          value: noop,
        },
      });

      assert.strictEqual(serialized, 'foo=;');
    });
  });
});
