export type Key = {
  pair: CryptoKeyPair;
  serializedPublicKey: string;
  serializedPrivateKey: string;
};

export async function newKeyPair(): Promise<Key> {
  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const [serializedPublicKey, serializedPrivateKey] = await Promise.all([
    keyToBase64(pair.publicKey),
    keyToBase64(pair.privateKey),
  ]);

  return { pair, serializedPublicKey, serializedPrivateKey };
}

async function keyToBase64(key: CryptoKey): Promise<string> {
  const format = key.type === 'public' ? 'spki' : 'pkcs8';
  const raw = await crypto.subtle.exportKey(format, key);
  return arrayBufferToBase64(raw);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
