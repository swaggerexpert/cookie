import { assert } from 'chai';

import parseCookieDate from '../../../src/set-cookie/parse/cookie-date.js';

const date = (iso) => new Date(iso);

describe('parseCookieDate', function () {
  specify('should parse rfc1123-date', function () {
    assert.deepEqual(
      parseCookieDate('Wed, 21 Oct 2015 07:28:00 GMT'),
      date('2015-10-21T07:28:00Z'),
    );
  });

  specify('should parse rfc850-date', function () {
    assert.deepEqual(
      parseCookieDate('Wednesday, 21-Oct-15 07:28:00 GMT'),
      date('2015-10-21T07:28:00Z'),
    );
  });

  specify('should parse asctime-date', function () {
    assert.deepEqual(parseCookieDate('Wed Oct 21 07:28:00 2015'), date('2015-10-21T07:28:00Z'));
  });

  specify('should parse non-padded time fields and long month names', function () {
    assert.deepEqual(parseCookieDate('21 October 2015 7:28:0'), date('2015-10-21T07:28:00Z'));
  });

  specify('should map two digit years', function () {
    assert.deepEqual(parseCookieDate('21 Oct 69 07:28:00'), date('2069-10-21T07:28:00Z'));
    assert.deepEqual(parseCookieDate('21 Oct 70 07:28:00'), date('1970-10-21T07:28:00Z'));
  });

  specify('should ignore time zone', function () {
    assert.deepEqual(
      parseCookieDate('Wed, 21 Oct 2015 07:28:00 GMT+0100'),
      date('2015-10-21T07:28:00Z'),
    );
  });

  specify('should fail on invalid dates', function () {
    [
      '',
      'invalid',
      'Wed, 21 Oct 2015',
      'Sun, 31 Feb 2016 00:00:00 GMT',
      'Wed, 21 Oct 1600 07:28:00 GMT',
      'Wed, 32 Oct 2015 07:28:00 GMT',
      'Wed, 21 Oct 2015 24:00:00 GMT',
      'Wed, 21 Oct 2015 07:60:00 GMT',
      'Wed, 21 Oct 2015 07:28:60 GMT',
    ].forEach((cookieDate) => {
      assert.isUndefined(parseCookieDate(cookieDate), cookieDate);
    });
  });
});
