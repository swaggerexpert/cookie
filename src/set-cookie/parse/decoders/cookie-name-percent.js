const cookieNamePercentDecoder = (cookieName) => {
  const value = String(cookieName);

  try {
    return decodeURIComponent(value);
  } catch (error) {
    throw new TypeError(`Invalid percent-encoded cookie name: ${value}`, { cause: error });
  }
};

export default cookieNamePercentDecoder;
