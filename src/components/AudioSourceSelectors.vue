<script setup lang="ts">
import { useDevicesList } from '@vueuse/core';
import { watchEffect } from 'vue';
const { videoInputs: cameras, audioInputs: microphones } = useDevicesList({
  requestPermissions: true,
});

watchEffect(() => console.log(microphones));
</script>

<template>
  <div class="row text-center">
    <div class="col-6">
      <q-icon name="camera" />
      <div>Camera ({{ cameras.length }})</div>
      <div v-for="i of cameras" :key="i.deviceId">
        {{ i.label }}
      </div>
    </div>
    <div class="col-6">
      <q-icon name="mic" />
      <div>Microphones ({{ microphones.length }})</div>
      <div v-for="i of microphones" :key="i.deviceId">
        {{ i.label }}
      </div>
    </div>
  </div>
</template>
