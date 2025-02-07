import base64Encoder from './base64.node.js';

const base64urlEncoder = (input) => {
  return base64Encoder(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export default base64urlEncoder;
