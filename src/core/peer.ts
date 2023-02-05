import Peer from 'peerjs';
import { serializedPublicKey } from './security';

export const peer = new Peer(serializedPublicKey, {
  secure: true,
});

await new Promise<unknown>((resolve, reject) => {
  peer.once('open', resolve);
  peer.once('error', reject);
});
