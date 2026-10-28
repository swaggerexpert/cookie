import { isBase64, decodeUTF8 } from '../../../utils.js';

const base64Decoder = (input) => {
  const value = String(input);

  if (!isBase64(value)) {
    throw new TypeError('Input must be a base64 encoded string.');
  }

  const binaryString = atob(value);

  // reject non-canonical encodings (e.g. non-zero padding bits)
  if (btoa(binaryString) !== value) {
    throw new TypeError('Input must be a canonically base64 encoded string.');
  }

  const bytes = new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)));
  return decodeUTF8(bytes);
};

export default base64Decoder;
