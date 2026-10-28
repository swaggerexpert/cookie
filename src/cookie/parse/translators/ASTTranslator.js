import CSTTranslator from './CSTTranslator.js';
import interpretAttributes from '../../../set-cookie/parse/attributes.js';
import { identity } from '../../../utils.js';

class ASTTranslator extends CSTTranslator {
  constructor({ decoders = {} } = {}) {
    super();

    this.decoders = { name: identity, value: identity, ...decoders };
  }

  transformCookiePair(node) {
    const cookieName = node.children.find(({ type }) => type === 'cookie-name');
    const cookieValue = node.children.find(({ type }) => type === 'cookie-value');

    return {
      name: this.decoders.name(cookieName.text),
      value: this.decoders.value(cookieValue.text),
    };
  }

  getTree() {
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
      .map((node) => ({ type: 'CookiePair', ...this.transformCookiePair(node) }));

    return { type: 'CookieString', pairs };
  }
}

export default ASTTranslator;
