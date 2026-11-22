import { identifiers } from 'apg-lite';

import { charsToString } from '../../../utils.js';

const list = (nodeType) => {
  return (state, chars, phraseIndex, phraseLength, data) => {
    if (state === identifiers.SEM_PRE) {
      if (Array.isArray(data) === false) {
        throw new Error("parser's user data must be an array");
      }
      data.push([nodeType, charsToString(chars, phraseIndex, phraseLength)]);
    }

    return identifiers.SEM_OK;
  };
};

export default list;
