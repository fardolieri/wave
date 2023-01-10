import { useLocalStorage } from '@vueuse/core';
import { Dialog } from 'quasar';
import AvatarPicker from '../components/AvatarPicker.vue';
import {
  arrayBufferToXBase64url,
  xBase64urlToArrayBuffer,
} from './x-base64-url-encoding';
import { username } from './username';

export type Key = {
  pair: CryptoKeyPair;
  serializedPublicKey: string;
  serializedPrivateKey: string;
};

const serializedPublicKey = useLocalStorage<string>('publicKey', null);
const serializedPrivateKey = useLocalStorage<string>('privateKey', null);

if (!serializedPublicKey.value) {
  const userInput = await forceUserToSelectAvatar();
  serializedPublicKey.value = userInput.key.serializedPublicKey;
  serializedPrivateKey.value = userInput.key.serializedPrivateKey;
  username.value = userInput.username;
}

const publicKey = await crypto.subtle.importKey(
  'spki',
  xBase64urlToArrayBuffer(serializedPublicKey.value),
  { name: 'RSA-OAEP', hash: 'SHA-256' },
  true,
  ['encrypt'],
);

const privateKey = await crypto.subtle.importKey(
  'pkcs8',
  xBase64urlToArrayBuffer(serializedPrivateKey.value),
  { name: 'RSA-OAEP', hash: 'SHA-256' },
  true,
  ['decrypt'],
);

export const securityKey: Key = {
  pair: { publicKey, privateKey },
  serializedPublicKey: serializedPublicKey.value,
  serializedPrivateKey: serializedPrivateKey.value,
};

function forceUserToSelectAvatar(): Promise<{
  key: Key;
  username: string;
}> {
  return new Promise((resolve) => {
    Dialog.create({
      component: AvatarPicker,
      componentProps: { persistent: true },
    }).onOk(resolve);
  });
}

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
  return arrayBufferToXBase64url(raw);
}
