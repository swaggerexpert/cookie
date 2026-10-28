import ASTTranslator from './ASTTranslator.js';

/**
 * Translates cookie pairs into a list of [name, value] entries, in order of appearance.
 * Unlike ObjectTranslator, all cookie pairs are retained, including duplicate cookie names.
 */
class EntriesTranslator extends ASTTranslator {
  getTree() {
    const ast = super.getTree();
    const pairs = ast.type === 'SetCookie' ? [ast] : ast.pairs;

    return pairs.map(({ name, value }) => [name, value]);
  }
}

export default EntriesTranslator;
