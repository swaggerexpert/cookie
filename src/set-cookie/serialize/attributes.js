import { Parser } from 'apg-lite';

import Grammar from '../../grammar.js';

const parser = new Parser();
const grammar = new Grammar();

const test = (startRule, value) => {
  try {
    return parser.parse(grammar, startRule, value).success;
  } catch {
    return false;
  }
};

const sameSiteValues = { strict: 'Strict', lax: 'Lax', none: 'None' };
const priorityValues = { low: 'Low', medium: 'Medium', high: 'High' };

const serializeExpires = (expires) => {
  // instanceof is not used, as it fails for Date objects from other realms (e.g. iframes)
  const isDate = Object.prototype.toString.call(expires) === '[object Date]';
  const isValidDate = isDate && !Number.isNaN(expires.getTime());
  // Date.prototype.toUTCString returns rfc1123-date (IMF-fixdate), e.g. "Thu, 21 Oct 2027 07:28:00 GMT"
  const date = isValidDate ? expires.toUTCString() : '';

  if (!test('sane-cookie-date', date)) {
    throw new TypeError(`Invalid Set-Cookie Expires attribute: ${String(expires)}`);
  }

  return `Expires=${date}`;
};

/**
 * Max-Age must be a safe integer, so that it is serialized as a sequence of digits (not e.g. "1e+21").
 * RFC 6265 grammar requires non-zero positive integer, but the user agent processing
 * (https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.2) defines zero and negative values
 * as immediate expiration, which is the common way of deleting a cookie.
 */
const serializeMaxAge = (maxAge) => {
  if (typeof maxAge !== 'number' || !Number.isSafeInteger(maxAge)) {
    throw new TypeError(`Invalid Set-Cookie Max-Age attribute: ${String(maxAge)}`);
  }

  return `Max-Age=${maxAge}`;
};

/**
 * Leading "." is not permitted by the grammar, but is ignored by user agents
 * (https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.3), so it is tolerated.
 */
const serializeDomain = (domain) => {
  const value = String(domain);
  const domainValue = value.startsWith('.') ? value.slice(1) : value;

  if (!test('domain-value', domainValue)) {
    throw new TypeError(`Invalid Set-Cookie Domain attribute: ${value}`);
  }

  return `Domain=${value}`;
};

const serializePath = (path) => {
  const value = String(path);

  if (!test('path-value', value)) {
    throw new TypeError(`Invalid Set-Cookie Path attribute: ${value}`);
  }

  return `Path=${value}`;
};

const serializeSameSite = (sameSite) => {
  const value = sameSiteValues[String(sameSite).toLowerCase()];

  if (value === undefined) {
    throw new TypeError(`Invalid Set-Cookie SameSite attribute: ${String(sameSite)}`);
  }

  return `SameSite=${value}`;
};

const serializePriority = (priority) => {
  const value = priorityValues[String(priority).toLowerCase()];

  if (value === undefined) {
    throw new TypeError(`Invalid Set-Cookie Priority attribute: ${String(priority)}`);
  }

  return `Priority=${value}`;
};

/**
 * Serializes Set-Cookie attributes. Attributes with `undefined` value are omitted.
 *
 * https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1
 * SameSite, Partitioned and Priority are not part of RFC 6265 and are serialized as extension-av.
 */
const serializeAttributes = ({
  expires,
  maxAge,
  domain,
  path,
  secure,
  httpOnly,
  sameSite,
  partitioned,
  priority,
}) => {
  const attributes = [];

  if (expires !== undefined) attributes.push(serializeExpires(expires));
  if (maxAge !== undefined) attributes.push(serializeMaxAge(maxAge));
  if (domain !== undefined) attributes.push(serializeDomain(domain));
  if (path !== undefined) attributes.push(serializePath(path));
  if (secure) attributes.push('Secure');
  if (httpOnly) attributes.push('HttpOnly');
  if (sameSite !== undefined) attributes.push(serializeSameSite(sameSite));
  if (partitioned) attributes.push('Partitioned');
  if (priority !== undefined) attributes.push(serializePriority(priority));

  return attributes;
};

export default serializeAttributes;
