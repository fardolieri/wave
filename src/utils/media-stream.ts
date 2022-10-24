import { shallowRef } from 'vue';

export const mediaStream = shallowRef<MediaStream>();

export async function requestMediaStream() {
  mediaStream.value = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: { frameRate: 144 },
  });
  console.log(mediaStream.value.getVideoTracks()[0].getSettings());
}
