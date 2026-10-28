import { assert } from 'chai';

import { testSetCookie } from '../../src/index.js';

describe('testSetCookie', function () {
  specify('should detect valid Set-Cookie strings', function () {
    assert.isTrue(testSetCookie('id=a'));
    assert.isTrue(testSetCookie('id='));
    assert.isTrue(testSetCookie('id=a; Path=/; Secure; HttpOnly'));
    assert.isTrue(testSetCookie('id=a; Expires=Thu, 21 Oct 2027 07:28:00 GMT'));
  });

  specify('should detect invalid Set-Cookie strings', function () {
    assert.isFalse(testSetCookie(''));
    assert.isFalse(testSetCookie('id'));
    assert.isFalse(testSetCookie('id=a;Secure'));
    assert.isFalse(testSetCookie('id = a'));
  });

  specify('should return false for non-string values', function () {
    assert.isFalse(testSetCookie(1));
    assert.isFalse(testSetCookie(null));
    assert.isFalse(testSetCookie(undefined));
  });

  context('given lenient mode', function () {
    specify('should detect valid Set-Cookie strings', function () {
      assert.isTrue(testSetCookie('id=a;Secure', { strict: false }));
      assert.isTrue(testSetCookie(' id = a b ; Max-Age=1.5', { strict: false }));
    });

    specify('should detect invalid Set-Cookie strings', function () {
      assert.isFalse(testSetCookie('id', { strict: false }));
      assert.isFalse(testSetCookie('=a', { strict: false }));
    });
  });
});
