<template>
  <svg class="jdent-icon" ref="svgRef"></svg>
</template>

<script setup lang="ts">
import { update } from 'jdenticon';
import { onMounted, ref } from 'vue';

const props = defineProps<{ hash: string }>();

const svgRef = ref();
onMounted(() => update(svgRef.value!, props.hash));
</script>
