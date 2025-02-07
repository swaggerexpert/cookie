const base64urlDecoder = (input) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const base64Padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
  const binaryString = atob(base64Padded);
  const bytes = new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
};

export default base64urlDecoder;
