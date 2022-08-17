<script setup lang="ts">
import { useDevicesList } from '@vueuse/core';
import { ref, watch } from 'vue';
const {
  videoInputs: cameras,
  audioInputs: microphones,
  ensurePermissions,
} = useDevicesList();

const selectedCam = ref<InputDeviceInfo>();
const selectedMic = ref<InputDeviceInfo>();

watch(cameras, (cams) => {
  selectedCam.value = cams.find((m) => m.deviceId === 'default');
});
watch(microphones, (mics) => {
  selectedMic.value = mics.find((m) => m.deviceId === 'default');
});
</script>

<template>
  <q-select
    class="single-line-value-select"
    v-model="selectedCam"
    :options="cameras"
    optionLabel="label"
    optionValue="deviceId"
    label="Videocam"
    @focus="ensurePermissions"
  >
    <template v-slot:prepend>
      <q-icon name="videocam" />
    </template>
  </q-select>
  <q-select
    class="single-line-value-select"
    v-model="selectedMic"
    :options="microphones"
    optionLabel="label"
    optionValue="deviceId"
    label="Microphone"
    @focus="ensurePermissions"
  >
    <template v-slot:prepend>
      <q-icon name="mic" />
    </template>
  </q-select>
</template>

<style lang="sass" scoped>
.q-select
  width: 200px

  :deep(.q-field__native > span)
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
</style>
