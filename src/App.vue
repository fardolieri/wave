<template>
  <div class="background">
    <transition-group
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <InitialLoadingScreen v-if="!csId" />
      <router-view v-else />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InitialLoadingScreen from './components/InitialLoadingScreen.vue';
import { csId } from './utils/use-id';

const loading = ref(true);
setTimeout(() => (loading.value = false), 1000);
</script>

<style lang="sass">
.background
  width: 100vw
  height: 100vh
  background: rgb(75,33,103)
  background: linear-gradient(163deg, #315699 0%, #312972 50%, #652893 100%)
</style>
