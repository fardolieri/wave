import { MaybeRef } from '@vueuse/core';
import { Ref, watch } from 'vue';
import { ref } from 'vue';

export function usePositionedAncestor(
  element: MaybeRef<HTMLElement | undefined | null>
): Ref<HTMLElement | undefined> {
  const elementRef = ref(element);
  const parentResult = ref<HTMLElement | undefined>();

  watch(
    elementRef,
    (elementRef) => {
      let parent = elementRef?.parentElement;
      while (
        parent &&
        window.getComputedStyle(parent).getPropertyValue('position') ===
          'static'
      ) {
        parent = parent.parentElement;
      }
      parentResult.value = parent ?? undefined;
    },
    { immediate: true }
  );

  return parentResult;
}
