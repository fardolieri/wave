import { useLocalStorage } from '@vueuse/core';

export const friendIds = useLocalStorage('friend-list', new Set<string>(), {
  serializer: {
    read: (rawArr: string) => new Set(JSON.parse(rawArr)),
    write: (set: Set<string>) => JSON.stringify([...set]),
  },
});
