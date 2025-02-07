import { Buffer } from 'buffer';

const base64urlDecoder = (input) => {
  return Buffer.from(input, 'base64url').toString();
};

export default base64urlDecoder;
