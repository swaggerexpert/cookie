import { assert } from 'chai';

import base64NodeDecoder from '../../../../src/set-cookie/parse/decoders/base64.node.js';
import base64BrowserDecoder from '../../../../src/set-cookie/parse/decoders/base64.browser.js';
import base64urlNodeDecoder from '../../../../src/set-cookie/parse/decoders/base64url.node.js';
import base64urlBrowserDecoder from '../../../../src/set-cookie/parse/decoders/base64url.browser.js';

[
  ['node', base64NodeDecoder, base64urlNodeDecoder],
  ['browser', base64BrowserDecoder, base64urlBrowserDecoder],
].forEach(([env, base64Decoder, base64urlDecoder]) => {
  describe(`base64.${env} decoder`, function () {
    it('should decode base64 encoded text', function () {
      assert.strictEqual(base64Decoder('SGVsbG8gV29ybGQ='), 'Hello World');
      assert.strictEqual(base64Decoder('aMOpbGxv'), 'héllo');
      assert.strictEqual(base64Decoder('Ow=='), ';');
      assert.strictEqual(base64Decoder(''), '');
    });

    it('should throw on invalid base64', function () {
      assert.throws(() => base64Decoder('b r'), TypeError);
      assert.throws(() => base64Decoder('Ow'), TypeError); // missing padding
      assert.throws(() => base64Decoder('O=w='), TypeError);
      assert.throws(() => base64Decoder('Ow-_'), TypeError); // base64url alphabet
    });

    it('should throw on non-canonical base64', function () {
      assert.throws(() => base64Decoder('Ox=='), TypeError);
    });

    it('should throw on invalid UTF-8', function () {
      assert.throws(() => base64Decoder('test'), TypeError);
    });
  });

  describe(`base64url.${env} decoder`, function () {
    it('should decode base64url encoded text', function () {
      assert.strictEqual(base64urlDecoder('SGVsbG8gV29ybGQ'), 'Hello World');
      assert.strictEqual(base64urlDecoder('Ow'), ';');
      assert.strictEqual(base64urlDecoder('Pz8-'), '??>');
      assert.strictEqual(base64urlDecoder(''), '');
    });

    it('should throw on invalid base64url', function () {
      assert.throws(() => base64urlDecoder('Ow=='), TypeError); // padding
      assert.throws(() => base64urlDecoder('Pz8+'), TypeError); // base64 alphabet
      assert.throws(() => base64urlDecoder('abcde'), TypeError); // invalid length
    });

    it('should throw on non-canonical base64url', function () {
      assert.throws(() => base64urlDecoder('en'), TypeError);
    });

    it('should throw on invalid UTF-8', function () {
      assert.throws(() => base64urlDecoder('test'), TypeError);
    });
  });
});
