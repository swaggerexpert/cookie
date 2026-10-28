import EntriesTranslator from './EntriesTranslator.js';

/**
 * Translates cookie pairs into an object mapping cookie names to cookie values.
 *
 * When cookie name appears multiple times, the first cookie value wins. This is a convention:
 * user agents SHOULD send cookies with longer paths first (https://datatracker.ietf.org/doc/html/rfc6265#section-5.4),
 * but servers SHOULD NOT rely on the order (https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.2).
 *
 * The object has null prototype, so cookie names like "__proto__" or "constructor" are plain own properties
 * and lookups of absent cookie names never return inherited Object.prototype members.
 */
class ObjectTranslator extends EntriesTranslator {
  getTree() {
    const entries = super.getTree();
    const cookies = Object.create(null);

    for (const [name, value] of entries) {
      if (!Object.prototype.hasOwnProperty.call(cookies, name)) {
        cookies[name] = value;
      }
    }

    return cookies;
  }
}

export default ObjectTranslator;
