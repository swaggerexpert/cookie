import cookieValueLenientEncoder from './cookie-value-lenient.js';
import base64Encoder from './base64.node.js';

const cookieValueLenientBase64Encoder = (cookieValue) => {
  return cookieValueLenientEncoder(cookieValue, base64Encoder);
};

export default cookieValueLenientBase64Encoder;
