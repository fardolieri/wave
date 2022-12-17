import { useLocalStorage } from '@vueuse/core';
import Peer from 'peerjs';
import { Dialog } from 'quasar';
import AvatarPicker from '../components/AvatarPicker.vue';

export const peerId = useLocalStorage<string>('peerId', null);
export const username = useLocalStorage<string>('username', '');

if (!peerId.value) {
  const userInput = await forceUserToSelectPeerId();
  peerId.value = userInput.peerId;
  username.value = userInput.username;
}

export const peer = new Peer(peerId.value, {
  debug: import.meta.env.DEV ? 3 : 0,
  secure: true,
});

await new Promise<unknown>((resolve, reject) => {
  peer.once('open', resolve);
  peer.once('error', reject);
});

async function forceUserToSelectPeerId(): Promise<{
  peerId: string;
  username: string;
}> {
  return await new Promise((resolve) => {
    Dialog.create({
      component: AvatarPicker,
      componentProps: { persistent: true },
    }).onOk(resolve);
  });
}
