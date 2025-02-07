import { assert } from 'chai';

import base64urlEncoder from '../../../../src/set-cookie/serialize/encoders/base64url.node.js';
import base64urlDecoder from '../../../../src/set-cookie/parse/decoders/base64url.node.js';

describe('base64url.node encoder', function () {
  it('should encode and decode Base64URL-safe strings', function () {
    const text = 'Hello World!';
    const encodedUrl = base64urlEncoder(text);
    const decodedUrl = base64urlDecoder(encodedUrl);
    assert.strictEqual(decodedUrl, text);
  });

  it('should remove padding and remain decodable in Base64URL', function () {
    const text = 'Padding Test';
    const encodedUrl = base64urlEncoder(text);
    assert.strictEqual(encodedUrl.includes('='), false); // should not contain padding

    const decodedUrl = base64urlDecoder(encodedUrl);
    assert.strictEqual(decodedUrl, text);
  });

  it('should correctly handle URL-safe characters', function () {
    const text = 'https://example.com?query=123';
    const encodedUrl = base64urlEncoder(text);
    const decodedUrl = base64urlDecoder(encodedUrl);
    assert.strictEqual(decodedUrl, text);
  });

  it('should handle non-multiple-of-4 Base64URL decoding', function () {
    const text = 'Non-multiple-4';
    const encodedUrl = base64urlEncoder(text);
    assert.notStrictEqual(encodedUrl.length % 4, 0); // ensure padding is removed

    const decodedUrl = base64urlDecoder(encodedUrl);
    assert.strictEqual(decodedUrl, text);
  });
});
