import CSTTranslator from './CSTTranslator.js';
import { identity } from '../../../utils.js';

class ASTTranslator extends CSTTranslator {
  constructor({ decoders = {} } = {}) {
    super();

    this.decoders = { name: identity, value: identity, ...decoders };
  }

  getTree() {
    const cst = super.getTree();
    const pairs = cst.children
      .filter(({ type }) => type === 'cookie-pair')
      .map((node) => {
        const cookieName = node.children.find(({ type }) => type === 'cookie-name');
        const cookieValue = node.children.find(({ type }) => type === 'cookie-value');

        return {
          type: 'CookiePair',
          name: this.decoders.name(cookieName.text),
          value: this.decoders.value(cookieValue.text),
        };
      });

    return { type: 'CookieString', pairs };
  }
}

export default ASTTranslator;
