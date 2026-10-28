import { Buffer } from 'buffer';

import { isBase64, decodeUTF8 } from '../../../utils.js';

const base64Decoder = (input) => {
  const value = String(input);

  if (!isBase64(value)) {
    throw new TypeError('Input must be a base64 encoded string.');
  }

  const bytes = Buffer.from(value, 'base64');

  // reject non-canonical encodings (e.g. non-zero padding bits)
  if (bytes.toString('base64') !== value) {
    throw new TypeError('Input must be a canonically base64 encoded string.');
  }

  return decodeUTF8(bytes);
};

export default base64Decoder;
