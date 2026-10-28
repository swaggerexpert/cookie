import parseCookieDate from './cookie-date.js';

/**
 * Interprets cookie-av following https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.
 * Attribute names are matched case-insensitively. Attributes with values that cannot be processed
 * are ignored. When attribute appears multiple times, the last one wins.
 * SameSite, Partitioned and Priority are not part of RFC 6265, but are recognized as well.
 */

const trimWSP = (value) => value.replace(/^[\t ]+|[\t ]+$/g, '');

const sameSiteValues = { strict: 'strict', lax: 'lax', none: 'none' };
const priorityValues = { low: 'low', medium: 'medium', high: 'high' };

const processors = {
  // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.1
  expires: (value) => {
    const date = parseCookieDate(value);
    return date === undefined ? undefined : ['expires', date];
  },
  // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.2
  'max-age': (value) => {
    if (!/^-?\d+$/.test(value)) return undefined;
    return ['maxAge', Number(value)];
  },
  // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.3
  domain: (value) => {
    if (value === '') return undefined;
    const domain = value.startsWith('.') ? value.slice(1) : value;
    return ['domain', domain.toLowerCase()];
  },
  // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.4
  // empty path or path not starting with "/" means default-path, which depends on request-uri
  path: (value) => {
    if (!value.startsWith('/')) return undefined;
    return ['path', value];
  },
  // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.5
  secure: () => ['secure', true],
  // https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.6
  httponly: () => ['httpOnly', true],
  // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis#section-5.6.7
  samesite: (value) => {
    const sameSite = sameSiteValues[value.toLowerCase()];
    return sameSite === undefined ? undefined : ['sameSite', sameSite];
  },
  // https://datatracker.ietf.org/doc/html/draft-cutler-httpbis-partitioned-cookies
  partitioned: () => ['partitioned', true],
  // https://datatracker.ietf.org/doc/html/draft-west-cookie-priority-00#section-4.1
  priority: (value) => {
    const priority = priorityValues[value.toLowerCase()];
    return priority === undefined ? undefined : ['priority', priority];
  },
};

/**
 * @param {string[]} cookieAvs - list of raw cookie-av strings
 * @returns {{ attributes: Object, extensions: Array<{ name: string, value?: string }> }}
 */
const interpretAttributes = (cookieAvs) => {
  const attributes = {};
  const extensions = [];

  for (const cookieAv of cookieAvs) {
    const separatorIndex = cookieAv.indexOf('=');
    const hasValue = separatorIndex !== -1;
    const name = trimWSP(hasValue ? cookieAv.slice(0, separatorIndex) : cookieAv);
    const value = hasValue ? trimWSP(cookieAv.slice(separatorIndex + 1)) : '';

    // empty attributes, e.g. caused by trailing ";", are ignored
    if (name === '' && !hasValue) continue;

    const processor = Object.prototype.hasOwnProperty.call(processors, name.toLowerCase())
      ? processors[name.toLowerCase()]
      : undefined;

    if (processor === undefined) {
      extensions.push(
        hasValue ? { type: 'CookieAttribute', name, value } : { type: 'CookieAttribute', name },
      );
      continue;
    }

    const processed = processor(value);
    if (processed !== undefined) {
      const [attributeName, attributeValue] = processed;
      attributes[attributeName] = attributeValue;
    }
  }

  return { attributes, extensions };
};

export default interpretAttributes;
