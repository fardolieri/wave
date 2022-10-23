<template>
  <div class="background">
    <router-view v-if="peerId"></router-view>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import AvatarPicker from './components/AvatarPicker.vue';
import { peerId } from './utils/use-id';

const $q = useQuasar();

if (!peerId.value) {
  $q.dialog({
    component: AvatarPicker,
    componentProps: { persistent: true },
  }).onOk((hash) => {
    peerId.value = hash;
  });
}
</script>

<style lang="sass">
.background
  width: 100vw
  height: 100vh
  background: rgb(75,33,103)
  background: linear-gradient(163deg, #315699 0%, #312972 50%, #652893 100%)
</style>
