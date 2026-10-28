import { assert } from 'chai';

import { testCookieName } from '../../src/index.js';

describe('testCookieName', function () {
  specify('should detect valid cookie names', function () {
    assert.isTrue(testCookieName('foo'));
    assert.isTrue(testCookieName('session_id'));
    assert.isTrue(testCookieName("!#$%&'*+-.^_`|~"));
  });

  specify('should detect invalid cookie names', function () {
    assert.isFalse(testCookieName(''));
    assert.isFalse(testCookieName('session id'));
    assert.isFalse(testCookieName('a=b'));
    assert.isFalse(testCookieName('a:b'));
    assert.isFalse(testCookieName('a;b'));
    assert.isFalse(testCookieName('"foo"'));
  });

  specify('should return false for non-string values', function () {
    assert.isFalse(testCookieName(1));
    assert.isFalse(testCookieName(null));
    assert.isFalse(testCookieName(undefined));
  });

  context('given lenient mode', function () {
    specify('should detect valid cookie names', function () {
      assert.isTrue(testCookieName('a:b', { strict: false }));
    });

    specify('should detect invalid cookie names', function () {
      assert.isFalse(testCookieName('', { strict: false }));
      assert.isFalse(testCookieName('a=b', { strict: false }));
      assert.isFalse(testCookieName('a b', { strict: false }));
    });
  });
});
