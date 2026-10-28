import { assert } from 'chai';
import { Stats } from 'apg-lite';

import { parseCookie } from '../../../src/index.js';

describe('parseCookie', function () {
  context('stats', function () {
    specify('should not produce stats by default', function () {
      const parseResult = parseCookie('foo=bar');

      assert.isUndefined(parseResult.stats);
    });

    specify('should produce stats when requested', function () {
      const parseResult = parseCookie('foo=bar', { stats: true });

      assert.instanceOf(parseResult.stats, Stats);
      assert.isString(parseResult.stats.displayStats());
      assert.isString(parseResult.stats.displayHits());
    });
  });
});
