import {
  MaybeComputedRef,
  useDraggable,
  UseDraggableOptions,
  useElementSize,
} from '@vueuse/core';
import { Ref, ref, watchEffect } from 'vue';

export function useDraggableWithBounding(
  target: Parameters<typeof useDraggable>[0],
  options: UseDraggableOptions & {
    boundingBox:
      | MaybeComputedRef<{
          left: number;
          right: number;
          top: number;
          bottom: number;
        }>
      | {
          bottom: Ref<number>;
          left: Ref<number>;
          right: Ref<number>;
          top: Ref<number>;
        };
  }
): ReturnType<typeof useDraggable> {
  const boundingBoxRef = ref(options.boundingBox) as Ref<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>;

  const drag = useDraggable(target, options);
  const targetRect = useElementSize(target);

  watchEffect(() => {
    drag.position.value.x = Math.max(
      drag.position.value.x,
      boundingBoxRef.value.left
    );
    drag.position.value.x = Math.min(
      drag.position.value.x,
      boundingBoxRef.value.right - targetRect.width.value
    );
    drag.position.value.y = Math.max(
      drag.position.value.y,
      boundingBoxRef.value.top
    );
    drag.position.value.y = Math.min(
      drag.position.value.y,
      boundingBoxRef.value.bottom - targetRect.height.value
    );
  });

  return drag;
}
