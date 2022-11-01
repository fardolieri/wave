import { useLocalStorage } from '@vueuse/core';
import Peer from 'peerjs';
import { Dialog } from 'quasar';
import { ref } from 'vue';
import AvatarPicker from '../components/AvatarPicker.vue';

export const peerId = useLocalStorage<string>('id', null);
peerId.value ??= await forceUserToSelectPeerId();

export const peerIsLoading = ref(true);
export const peerIsReady = ref(false);

export const peer = ref(new Peer(peerId.value, { debug: 0 }));

peer.value.on('open', () => {
  peerIsLoading.value = false;
  peerIsReady.value = true;
});

peer.value.on('disconnected', () => {
  peerIsLoading.value = true;
  peerIsReady.value = false;
  peer.value.reconnect();
});

async function forceUserToSelectPeerId(): Promise<string> {
  return await new Promise((resolve) => {
    Dialog.create({
      component: AvatarPicker,
      componentProps: { persistent: true },
    }).onOk((hash: string) => {
      resolve(hash);
    });
  });
}
