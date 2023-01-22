import { Dialog } from 'quasar';
import AvatarPicker from '../components/AvatarPicker.vue';
import { myUsername } from './username';
import { base33Decode, base33Encode } from './base33';

const algorithm = { name: 'RSA-OAEP', hash: 'SHA-256' } as const;

const serializedPrivateKeyAccessor = Symbol();

export type KeyPair = {
  pair: CryptoKeyPair;
  serializedPublicKey: string;
  [serializedPrivateKeyAccessor]: string;
};

let serializedPublicKey = localStorage.getItem('publicKey');
let serializedPrivateKey = localStorage.getItem('privateKey');

if (!serializedPublicKey || !serializedPrivateKey) {
  const userInput = await forceUserToSelectAvatar();

  myUsername.value = userInput.username;

  serializedPublicKey = userInput.keyPair.serializedPublicKey;
  serializedPrivateKey = userInput.keyPair[serializedPrivateKeyAccessor];
  localStorage.setItem('publicKey', serializedPublicKey);
  localStorage.setItem('privateKey', serializedPrivateKey);
}

const privateKey = await decodeKey(serializedPrivateKey, 'private');

// Workaround to have a non nullable export
const exportSerializedPublicKey: string = serializedPublicKey;
export { exportSerializedPublicKey as serializedPublicKey };

function forceUserToSelectAvatar(): Promise<{
  keyPair: KeyPair;
  username: string;
}> {
  return new Promise((resolve) => {
    Dialog.create({
      component: AvatarPicker,
      componentProps: { persistent: true },
    }).onOk(resolve);
  });
}

export async function newKeyPair(): Promise<KeyPair> {
  const pair = await crypto.subtle.generateKey(
    {
      ...algorithm,
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const [serializedPublicKey, serializedPrivateKey] = await Promise.all([
    serializeKey(pair.publicKey),
    serializeKey(pair.privateKey),
  ]);

  return {
    pair,
    serializedPublicKey,
    [serializedPrivateKeyAccessor]: serializedPrivateKey,
  };
}

async function serializeKey(key: CryptoKey): Promise<string> {
  const format = key.type === 'public' ? 'spki' : 'pkcs8';
  const raw = await crypto.subtle.exportKey(format, key);
  return base33Encode(raw);
}

export async function decodeKey(
  serializedKey: string,
  type: 'public' | 'private',
): Promise<CryptoKey> {
  const format = type === 'public' ? 'spki' : 'pkcs8';
  const keyUsages: KeyUsage[] = type === 'public' ? ['encrypt'] : ['decrypt'];
  const arrayBuffer = base33Decode(serializedKey);

  const key = await crypto.subtle.importKey(
    format,
    arrayBuffer,
    algorithm,
    true,
    keyUsages,
  );

  return key;
}

export async function generateRiddle(serializedKey: string): Promise<{
  riddle: number[];
  solution: number[];
}> {
  const key = await decodeKey(serializedKey, 'public');
  const solution = crypto.getRandomValues(new Uint8Array(100)).buffer;
  const riddle = await crypto.subtle.encrypt(algorithm, key, solution);

  return {
    riddle: [...new Uint8Array(riddle)],
    solution: [...new Uint8Array(solution)],
  };
}

export async function decrypt(data: number[]): Promise<number[]> {
  const uint8Arr = new Uint8Array(data);
  const arrayBufferResult = await crypto.subtle.decrypt(
    algorithm,
    privateKey,
    uint8Arr,
  );

  const result = [...new Uint8Array(arrayBufferResult)];
  return result;
}
