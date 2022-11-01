<template>
  <material-symbols-outlined-setup />
  <div class="background">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import MaterialSymbolsOutlinedSetup from './layouts/MaterialSymbolsOutlinedSetup.vue';
</script>

<style lang="sass">
.background
  width: 100vw
  height: 100vh
  background: rgb(75,33,103)
  background: linear-gradient(163deg, #315699 0%, #312972 50%, #652893 100%)
</style>
