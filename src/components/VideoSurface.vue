<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { mediaStream } from 'src/utils/media-stream';
import DraggableWithBounding from 'src/utils/renderless-components/DraggableWithBounding.vue';
import { onMounted, ref, watch } from 'vue';

const videoRef = ref<HTMLVideoElement>();

onMounted(trySettingSrcObject);
watch(mediaStream, trySettingSrcObject);

function trySettingSrcObject(): void {
  if (!videoRef.value) return;
  videoRef.value.srcObject = mediaStream.value ?? null;
}

const { width } = useWindowSize();
</script>

<template>
  <DraggableWithBounding :padding="5" v-if="width > 600">
    <div class="video-container shadow-3">
      <div v-show="!mediaStream" class="video-skeleton"></div>
      <video v-show="mediaStream" ref="videoRef" autoplay></video>
    </div>
  </DraggableWithBounding>
</template>

<style scoped lang="sass">
.video-container
  align-self: flex-start
  display: flex
  cursor: move

video, .video-skeleton
  width: 300px
  aspect-ratio: 16 / 9

.video-skeleton
  border-radius: 3px
  background-color: #85919e
  background: radial-gradient(ellipse at center, $grey-4 0%, $dark-alt-2 100%)
</style>
