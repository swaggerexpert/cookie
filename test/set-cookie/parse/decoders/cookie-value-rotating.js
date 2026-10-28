import { assert } from 'chai';

import {
  cookieValueRotatingDecoder,
  createCookieValueRotatingDecoder,
  cookieValuePercentDecoder,
  cookieValueBase64urlDecoder,
  serializeCookie,
  cookieValueStrictPercentEncoder,
} from '../../../../src/index.js';

describe('cookieValueRotatingDecoder', function () {
  it('should decode base64url encoded values', function () {
    assert.strictEqual(cookieValueRotatingDecoder('aGVsbG8'), 'hello');
    assert.strictEqual(cookieValueRotatingDecoder('aMOpbGxv'), 'héllo');
  });

  it('should decode base64 encoded values', function () {
    assert.strictEqual(cookieValueRotatingDecoder('Pz8+'), '??>');
  });

  it('should decode percent-encoded values', function () {
    assert.strictEqual(cookieValueRotatingDecoder('hello%20world'), 'hello world');
  });

  it('should keep plain values', function () {
    ['bar', 'test', 'admin', 'en', 'abc123', 'true', '1234', 'user', ''].forEach((value) => {
      assert.strictEqual(cookieValueRotatingDecoder(value), value);
    });
  });

  it('should keep values no decoder can decode', function () {
    assert.strictEqual(cookieValueRotatingDecoder('%E0%A4%A'), '%E0%A4%A');
  });

  it('should be ambiguous for values valid in multiple encodings', function () {
    // plain `Ow` cannot be distinguished from base64url encoded `;`
    assert.strictEqual(cookieValueRotatingDecoder('Ow'), ';');
  });

  it('should reverse default serializeCookie value encoding', function () {
    const cookieString = serializeCookie({ a: ';', b: 'héllo wörld', c: 'bar' });
    assert.strictEqual(cookieString, 'a=Ow; b=aMOpbGxvIHfDtnJsZA; c=bar');

    const values = cookieString
      .split('; ')
      .map((pair) => cookieValueRotatingDecoder(pair.split('=')[1]));
    assert.deepEqual(values, [';', 'héllo wörld', 'bar']);
  });

  context('createCookieValueRotatingDecoder', function () {
    it('should try decoders in provided order', function () {
      const decoder = createCookieValueRotatingDecoder([
        cookieValuePercentDecoder,
        cookieValueBase64urlDecoder,
      ]);

      assert.strictEqual(decoder('Ow'), 'Ow');
      assert.strictEqual(decoder(cookieValueStrictPercentEncoder('a b')), 'a b');
    });

    it('should return value as is when no decoder is provided', function () {
      assert.strictEqual(createCookieValueRotatingDecoder([])('Ow'), 'Ow');
    });
  });
});
