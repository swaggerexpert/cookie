import serializeSetCookie from '../../set-cookie/serialize/index.js';

const serialize = (cookiePairs, { encoders, validators } = {}) => {
  const cookiePairEntries = Array.isArray(cookiePairs)
    ? cookiePairs
    : typeof cookiePairs === 'object' && cookiePairs !== null
      ? Object.entries(cookiePairs)
      : [];

  return (
    cookiePairEntries
      // Cookie header consists of cookie pairs only, Set-Cookie specific options must not be passed
      .map(([name, value]) => serializeSetCookie(name, value, { encoders, validators }))
      .join('; ')
  );
};

export default serialize;
