import { assert } from 'chai';

import { parseCookie, Trace } from '../../../src/index.js';

describe('parseCookie', function () {
  context('trace', function () {
    specify('should not produce trace by default', function () {
      const parseResult = parseCookie('foo=bar');

      assert.isUndefined(parseResult.trace);
    });

    specify('should produce trace when requested', function () {
      const parseResult = parseCookie('foo=bar', { trace: true });

      assert.instanceOf(parseResult.trace, Trace);
      assert.isString(parseResult.trace.displayTrace());
    });

    specify('should infer expectations for missing equals sign', function () {
      const { result, trace } = parseCookie('foo', { trace: true });

      assert.isFalse(result.success);
      assert.include(trace.inferExpectations(), '=');
    });
  });
});
