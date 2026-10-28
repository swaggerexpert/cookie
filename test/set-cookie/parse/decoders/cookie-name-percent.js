import { assert } from 'chai';

import { cookieNamePercentDecoder, cookieNameStrictPercentEncoder } from '../../../../src/index.js';

describe('cookieNamePercentDecoder', function () {
  it('should decode percent-encoded cookie name', function () {
    assert.strictEqual(cookieNamePercentDecoder('session%20id'), 'session id');
    assert.strictEqual(cookieNamePercentDecoder('foo'), 'foo');
  });

  it('should reverse cookieNameStrictPercentEncoder', function () {
    const name = 'a=b; c';
    assert.strictEqual(cookieNamePercentDecoder(cookieNameStrictPercentEncoder(name)), name);
  });

  it('should throw on malformed percent-encoding', function () {
    assert.throws(() => cookieNamePercentDecoder('foo%E0%A4%A'), TypeError);
  });
});
