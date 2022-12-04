<script setup lang="ts">
import { useElementBounding } from '@vueuse/core';
import { computed, ref } from 'vue';
import { usePositionedAncestor } from '../get-positioned-ancestor';
import { useDraggableWithBounding } from '../use-draggable-without-bounding';

const props = defineProps<{ padding?: number }>();

const dragRef = ref<HTMLElement>();
const positionedAncestorHelper = ref<HTMLElement>();

const dragContainer = usePositionedAncestor(positionedAncestorHelper);
const { top, bottom, left, right } = useElementBounding(dragContainer);
const boundingBox = computed(() => ({
  top: top.value + (props.padding ?? 0),
  bottom: bottom.value - (props.padding ?? 0),
  left: left.value + (props.padding ?? 0),
  right: right.value - (props.padding ?? 0),
}));

const { style } = useDraggableWithBounding(dragRef, {
  boundingBox,
  preventDefault: true, // prevents selecting text during drag
});
</script>

<template>
  <div ref="positionedAncestorHelper" style="display: none"></div>

  <teleport to="body">
    <div
      ref="dragRef"
      :style="`position: fixed; z-index: 4000; ${style}`"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
  </teleport>
</template>
