import { Ast as AST } from 'apg-lite';

import cstCallback from '../callbacks/cst.js';

class CSTTranslator extends AST {
  constructor() {
    super();

    // strict rules
    this.callbacks['cookie-string'] = cstCallback('cookie-string');
    this.callbacks['cookie-pair'] = cstCallback('cookie-pair');
    this.callbacks['cookie-name'] = cstCallback('cookie-name');
    this.callbacks['cookie-value'] = cstCallback('cookie-value');

    // lenient rules
    this.callbacks['lenient-cookie-string'] = cstCallback('cookie-string');
    this.callbacks['lenient-cookie-pair'] = cstCallback('cookie-pair');
    this.callbacks['lenient-cookie-name'] = cstCallback('cookie-name');
    this.callbacks['lenient-cookie-value'] = cstCallback('cookie-value');

    // Set-Cookie strict rules (cookie-pair, cookie-name and cookie-value are shared with Cookie)
    this.callbacks['set-cookie-string'] = cstCallback('set-cookie-string');
    this.callbacks['cookie-av'] = cstCallback('cookie-av');

    // Set-Cookie lenient rules
    this.callbacks['lenient-set-cookie-string'] = cstCallback('set-cookie-string');
    this.callbacks['lenient-set-cookie-pair'] = cstCallback('cookie-pair');
    this.callbacks['lenient-set-cookie-name'] = cstCallback('cookie-name');
    this.callbacks['lenient-set-cookie-value'] = cstCallback('cookie-value');
    this.callbacks['lenient-cookie-av'] = cstCallback('cookie-av');
  }

  getTree() {
    const data = { stack: [], root: null };
    this.translate(data);
    return data.root;
  }
}

export default CSTTranslator;
