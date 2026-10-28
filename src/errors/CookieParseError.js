import CookieError from './CookieError.js';

class CookieParseError extends CookieError {}

Object.defineProperty(CookieParseError, 'name', { value: 'CookieParseError' });

export default CookieParseError;
