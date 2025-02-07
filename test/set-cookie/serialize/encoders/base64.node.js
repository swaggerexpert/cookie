import { assert } from 'chai';

import base64Encoder from '../../../../src/set-cookie/serialize/encoders/base64.node.js';
import base64Decoder from '../../../../src/set-cookie/parse/decoders/base64.node.js';

describe('base64.node encoder', function () {
  it('should encode and decode ASCII text', function () {
    const text = 'Hello World';
    const encoded = base64Encoder(text);
    const decoded = base64Decoder(encoded);
    assert.strictEqual(decoded, text);
  });

  it('should encode and decode Unicode text (emoji)', function () {
    const text = 'Hello 🌍';
    const encoded = base64Encoder(text);
    const decoded = base64Decoder(encoded);
    assert.strictEqual(decoded, text);
  });

  it('should encode and decode Unicode text (non-Latin)', function () {
    const text = 'こんにちは世界'; // Japanese: "Hello, World"
    const encoded = base64Encoder(text);
    const decoded = base64Decoder(encoded);
    assert.strictEqual(decoded, text);
  });

  it('should encode and decode an empty string', function () {
    const text = '';
    const encoded = base64Encoder(text);
    const decoded = base64Decoder(encoded);
    assert.strictEqual(decoded, text);
  });

  it('should encode and decode a long string', function () {
    const text = 'A'.repeat(1000);
    const encoded = base64Encoder(text);
    const decoded = base64Decoder(encoded);
    assert.strictEqual(decoded, text);
  });

  it('should correctly handle special characters', function () {
    const text = '!@#$%^&*()_+=-';
    const encoded = base64Encoder(text);
    const decoded = base64Decoder(encoded);
    assert.strictEqual(decoded, text);
  });
});
