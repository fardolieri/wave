import { useLocalStorage } from '@vueuse/core';

export const peerId = useLocalStorage<string>('id', null);

export const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
