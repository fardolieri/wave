<script setup lang="ts">
import { mediaStream } from 'src/utils/media-stream';
import { onMounted, ref, watch } from 'vue';

const videoRef = ref<HTMLVideoElement>();

onMounted(trySettingSrcObject);
watch(mediaStream, trySettingSrcObject);

function trySettingSrcObject(): void {
  if (!videoRef.value) return;
  videoRef.value.srcObject = mediaStream.value ?? null;
}
</script>

<template>
  <div class="video-container shadow-3">
    <div v-show="!mediaStream" class="video-skeleton"></div>
    <video v-show="mediaStream" ref="videoRef" autoplay></video>
  </div>
</template>

<style scoped lang="sass">
.video-container
  align-self: flex-start
  display: flex

video, .video-skeleton
  width: 300px
  aspect-ratio: 16 / 9

.video-skeleton
  border-radius: 3px
  background-color: #85919e
  background: radial-gradient(ellipse at center, $grey-4 0%, $dark-alt-2 100%)
</style>
