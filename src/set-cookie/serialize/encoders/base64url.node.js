import { Buffer } from 'buffer';

const base64urlEncoder = (input) => {
  return Buffer.from(input).toString('base64url');
};

export default base64urlEncoder;
