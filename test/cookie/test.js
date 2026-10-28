import { assert } from 'chai';

import { testCookie } from '../../src/index.js';

describe('testCookie', function () {
  specify('should detect valid cookie strings', function () {
    assert.isTrue(testCookie('foo=bar'));
    assert.isTrue(testCookie('foo="bar"'));
    assert.isTrue(testCookie('foo='));
    assert.isTrue(testCookie('foo=bar; baz=raz'));
  });

  specify('should detect invalid cookie strings', function () {
    assert.isFalse(testCookie(''));
    assert.isFalse(testCookie('foo'));
    assert.isFalse(testCookie('foo=bar;baz=raz'));
    assert.isFalse(testCookie('foo = bar'));
    assert.isFalse(testCookie('foo=bar; fizz'));
  });

  specify('should return false for non-string values', function () {
    assert.isFalse(testCookie(1));
    assert.isFalse(testCookie(null));
    assert.isFalse(testCookie(undefined));
    assert.isFalse(testCookie({}));
  });

  context('given lenient mode', function () {
    specify('should detect valid cookie strings', function () {
      assert.isTrue(testCookie('foo=bar;baz=raz', { strict: false }));
      assert.isTrue(testCookie('foo = bar', { strict: false }));
      assert.isTrue(testCookie('foo=bar; fizz', { strict: false }));
    });

    specify('should detect invalid cookie strings', function () {
      assert.isFalse(testCookie('', { strict: false }));
      assert.isFalse(testCookie('=bar', { strict: false }));
    });
  });
});
