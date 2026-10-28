import { isBase64url, toBase64 } from '../../../utils.js';
import base64Decoder from './base64.node.js';

const base64urlDecoder = (input) => {
  const value = String(input);

  if (!isBase64url(value)) {
    throw new TypeError('Input must be a base64url encoded string.');
  }

  return base64Decoder(toBase64(value));
};

export default base64urlDecoder;
