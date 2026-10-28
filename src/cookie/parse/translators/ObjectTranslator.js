import ASTTranslator from './ASTTranslator.js';

/**
 * Translates cookie pairs into a plain object mapping cookie names to cookie values.
 *
 * When cookie name appears multiple times, the first cookie value wins. User agents send cookies
 * with more specific paths first (https://datatracker.ietf.org/doc/html/rfc6265#section-5.4).
 *
 * Properties are defined (not assigned), so cookie names like "__proto__" can't modify the object prototype.
 */
class ObjectTranslator extends ASTTranslator {
  getTree() {
    const ast = super.getTree();
    const pairs = ast.type === 'SetCookie' ? [ast] : ast.pairs;
    const cookies = {};

    for (const { name, value } of pairs) {
      if (Object.prototype.hasOwnProperty.call(cookies, name)) continue;

      Object.defineProperty(cookies, name, {
        value,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }

    return cookies;
  }
}

export default ObjectTranslator;
