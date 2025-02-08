import cookieValueStrictBase64Encoder from './cookie-value-strict-base64.js';
import base64urlEncoder from './base64url.node.js';

const cookieValueStrictBase64urlEncoder = (cookieValue) => {
  return cookieValueStrictBase64Encoder(cookieValue, base64urlEncoder);
};

export default cookieValueStrictBase64urlEncoder;
