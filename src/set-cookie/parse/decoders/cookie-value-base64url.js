import cookieValueBase64Decoder from './cookie-value-base64.js';
import base64urlDecoder from './base64url.node.js';

const cookieValueBase64urlDecoder = (cookieValue) => {
  return cookieValueBase64Decoder(cookieValue, base64urlDecoder);
};

export default cookieValueBase64urlDecoder;
