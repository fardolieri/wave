import { useLocalStorage } from '@vueuse/core';
import Peer from 'peerjs';
import { Dialog } from 'quasar';
import { ref } from 'vue';
import AvatarPicker from '../components/AvatarPicker.vue';

export const peerId = useLocalStorage<string>('id', null);
export const username = useLocalStorage<string>('username', '');

if (!peerId.value) {
  const userInput = await forceUserToSelectPeerId();
  peerId.value = userInput.hash;
  username.value = userInput.username;
}

export const peerIsLoading = ref(true);
export const peerIsReady = ref(false);

export const peer = ref(
  new Peer(peerId.value, { debug: import.meta.env.DEV ? 3 : 0 }),
);

await new Promise<void>((resolve) => {
  peer.value.on('open', () => {
    peerIsLoading.value = false;
    peerIsReady.value = true;
    resolve();
  });
});

peer.value.on('disconnected', () => {
  peerIsLoading.value = true;
  peerIsReady.value = false;
  peer.value.reconnect();
});

async function forceUserToSelectPeerId(): Promise<{
  hash: string;
  username: string;
}> {
  return await new Promise((resolve) => {
    Dialog.create({
      component: AvatarPicker,
      componentProps: { persistent: true },
    }).onOk((userInput) => {
      resolve(userInput);
    });
  });
}
