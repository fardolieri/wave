import type { generalAnimations } from '@quasar/extras/animate/animate-list';

export function animateElement(
  element: Element,
  animation: generalAnimations,
  speed?: 'slow' | 'slower' | 'fast' | 'faster'
): Promise<void> {
  return new Promise((resolve) => {
    const animationClasses = ['animated', animation];
    if (speed) animationClasses.push(speed);

    element.classList.add(...animationClasses);

    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(...animationClasses);
        resolve();
      },
      { once: true }
    );
  });
}
