import { toBase64url } from '../../../utils.js';
import base64Encoder from './base64.node.js';

const base64urlEncoder = (input) => {
  return toBase64url(base64Encoder(input));
};

export default base64urlEncoder;
