import cookieValueLenientEncoder from './cookie-value-lenient.js';
import base64urlEncoder from './base64url.node.js';

const cookieValueLenientBase64urlEncoder = (cookieValue) => {
  return cookieValueLenientEncoder(cookieValue, base64urlEncoder);
};

export default cookieValueLenientBase64urlEncoder;
