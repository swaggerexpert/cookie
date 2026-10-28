import { assert } from 'chai';

import { testCookieValue } from '../../src/index.js';

describe('testCookieValue', function () {
  specify('should detect valid cookie values', function () {
    assert.isTrue(testCookieValue('bar'));
    assert.isTrue(testCookieValue(''));
    assert.isTrue(testCookieValue('"bar"'));
    assert.isTrue(testCookieValue('""'));
  });

  specify('should detect invalid cookie values', function () {
    assert.isFalse(testCookieValue('b r'));
    assert.isFalse(testCookieValue('b;r'));
    assert.isFalse(testCookieValue('b,r'));
    assert.isFalse(testCookieValue('b\\r'));
    assert.isFalse(testCookieValue('"bar'));
  });

  specify('should return false for non-string values', function () {
    assert.isFalse(testCookieValue(1));
    assert.isFalse(testCookieValue(null));
    assert.isFalse(testCookieValue(undefined));
  });

  context('given quoted option', function () {
    specify('should require DQUOTEs when true', function () {
      assert.isTrue(testCookieValue('"bar"', { quoted: true }));
      assert.isFalse(testCookieValue('bar', { quoted: true }));
    });

    specify('should forbid DQUOTEs when false', function () {
      assert.isTrue(testCookieValue('bar', { quoted: false }));
      assert.isFalse(testCookieValue('"bar"', { quoted: false }));
    });
  });

  context('given lenient mode', function () {
    specify('should detect valid cookie values', function () {
      assert.isTrue(testCookieValue('b\\r', { strict: false }));
      assert.isTrue(testCookieValue('"b r"', { strict: false }));
    });

    specify('should detect invalid cookie values', function () {
      assert.isFalse(testCookieValue('b;r', { strict: false }));
    });
  });
});
