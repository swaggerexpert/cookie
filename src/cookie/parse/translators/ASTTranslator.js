import CSTTranslator from './CSTTranslator.js';
import interpretAttributes from '../../../set-cookie/parse/attributes.js';
import { identity } from '../../../utils.js';

class ASTTranslator extends CSTTranslator {
  constructor({ decoders = {} } = {}) {
    super();

    this.decoders = { name: identity, value: identity, ...decoders };
  }

  /**
   * @param {Object} node - CST node of the cookie pair
   * @param {Function} [onDecodeError] - called with the node when its name or value fails to decode,
   * `undefined` is returned then. Without it, decoder errors are thrown.
   */
  transformCookiePair(node, onDecodeError) {
    const cookieName = node.children.find(({ type }) => type === 'cookie-name');
    const cookieValue = node.children.find(({ type }) => type === 'cookie-value');

    try {
      return {
        name: this.decoders.name(cookieName.text),
        value: this.decoders.value(cookieValue.text),
      };
    } catch (error) {
      if (onDecodeError === undefined) throw error;
      onDecodeError(node);
      return undefined;
    }
  }

  /**
   * @param {Object} [options]
   * @param {Function} [options.onDecodeError] - called with the CST node of a cookie pair whose name or value
   * fails to decode; the pair is left out of the tree. Without it, decoder errors are thrown.
   * Subclasses overriding getTree need to forward the options.
   * Used internally by parseCookie in recovering mode.
   * @private
   */
  getTree({ onDecodeError } = {}) {
    const cst = super.getTree();

    if (cst.type === 'set-cookie-string') {
      const cookiePair = cst.children.find(({ type }) => type === 'cookie-pair');
      const cookieAvs = cst.children
        .filter(({ type }) => type === 'cookie-av')
        .map(({ text }) => text);
      const { name, value } = this.transformCookiePair(cookiePair);
      const { attributes, extensions } = interpretAttributes(cookieAvs);

      return { type: 'SetCookie', name, value, attributes, extensions };
    }

    const pairs = cst.children
      .filter(({ type }) => type === 'cookie-pair')
      .map((node) => this.transformCookiePair(node, onDecodeError))
      .filter((pair) => pair !== undefined)
      .map((pair) => ({ type: 'CookiePair', ...pair }));

    return { type: 'CookieString', pairs };
  }
}

export default ASTTranslator;
