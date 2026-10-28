import { assert } from 'chai';

import {
  cookieValuePercentDecoder,
  cookieValueBase64Decoder,
  cookieValueBase64urlDecoder,
  cookieValueStrictPercentEncoder,
  cookieValueStrictBase64Encoder,
  cookieValueStrictBase64urlEncoder,
} from '../../../../src/index.js';

describe('cookieValuePercentDecoder', function () {
  it('should decode percent-encoded cookie value', function () {
    assert.strictEqual(cookieValuePercentDecoder('hello%20world'), 'hello world');
    assert.strictEqual(cookieValuePercentDecoder('bar'), 'bar');
  });

  it('should preserve quotes', function () {
    assert.strictEqual(cookieValuePercentDecoder('"hello%20world"'), '"hello world"');
  });

  it('should reverse cookieValueStrictPercentEncoder', function () {
    const value = 'a b;c,d\\é';
    assert.strictEqual(cookieValuePercentDecoder(cookieValueStrictPercentEncoder(value)), value);
  });

  it('should throw on malformed percent-encoding', function () {
    assert.throws(() => cookieValuePercentDecoder('%E0%A4%A'), TypeError);
  });
});

describe('cookieValueBase64Decoder', function () {
  it('should decode base64 encoded cookie value', function () {
    assert.strictEqual(cookieValueBase64Decoder('Ow=='), ';');
  });

  it('should preserve quotes', function () {
    assert.strictEqual(cookieValueBase64Decoder('"Ow=="'), '";"');
  });

  it('should reverse cookieValueStrictBase64Encoder', function () {
    const value = 'a b;c,d\\é';
    assert.strictEqual(cookieValueBase64Decoder(cookieValueStrictBase64Encoder(value)), value);
  });

  it('should throw on value that is not base64 encoded', function () {
    assert.throws(() => cookieValueBase64Decoder('b r'), TypeError);
  });
});

describe('cookieValueBase64urlDecoder', function () {
  it('should decode base64url encoded cookie value', function () {
    assert.strictEqual(cookieValueBase64urlDecoder('Ow'), ';');
  });

  it('should preserve quotes', function () {
    assert.strictEqual(cookieValueBase64urlDecoder('"Ow"'), '";"');
  });

  it('should reverse cookieValueStrictBase64urlEncoder', function () {
    const value = 'a b;c,d\\é??>';
    assert.strictEqual(
      cookieValueBase64urlDecoder(cookieValueStrictBase64urlEncoder(value)),
      value,
    );
  });

  it('should throw on value that is not base64url encoded', function () {
    assert.throws(() => cookieValueBase64urlDecoder('bar'), TypeError);
  });
});
