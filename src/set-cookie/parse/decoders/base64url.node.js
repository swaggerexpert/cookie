import { toBase64 } from '../../../utils.js';
import base64Decoder from './base64.node.js';

const base64urlDecoder = (input) => {
  const base64 = toBase64(input);
  return base64Decoder(base64);
};

export default base64urlDecoder;
