import { Ast as AST } from 'apg-lite';

import listCallback from '../callbacks/list.js';

class ListTranslator extends AST {
  constructor() {
    super();

    // strict rules
    this.callbacks['cookie-string'] = listCallback('cookie-string');
    this.callbacks['cookie-pair'] = listCallback('cookie-pair');
    this.callbacks['cookie-name'] = listCallback('cookie-name');
    this.callbacks['cookie-value'] = listCallback('cookie-value');

    // lenient rules
    this.callbacks['lenient-cookie-string'] = listCallback('cookie-string');
    this.callbacks['lenient-cookie-pair'] = listCallback('cookie-pair');
    this.callbacks['lenient-cookie-name'] = listCallback('cookie-name');
    this.callbacks['lenient-cookie-value'] = listCallback('cookie-value');
  }

  getTree() {
    const parts = [];
    this.translate(parts);
    return parts;
  }
}

export default ListTranslator;
