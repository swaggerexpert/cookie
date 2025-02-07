import base64Decoder from './base64.node.js';

const base64urlDecoder = (input) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const base64Padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
  return base64Decoder(base64Padded);
};

export default base64urlDecoder;
