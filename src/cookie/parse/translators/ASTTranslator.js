import CSTTranslator from './CSTTranslator.js';

const transformCookiePair = (node) => {
  const cookieName = node.children.find(({ type }) => type === 'cookie-name');
  const cookieValue = node.children.find(({ type }) => type === 'cookie-value');

  return { type: 'CookiePair', name: cookieName.text, value: cookieValue.text };
};

class ASTTranslator extends CSTTranslator {
  getTree() {
    const cst = super.getTree();
    const pairs = cst.children
      .filter(({ type }) => type === 'cookie-pair')
      .map(transformCookiePair);

    return { type: 'CookieString', pairs };
  }
}

export default ASTTranslator;
