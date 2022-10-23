import { useLocalStorage } from '@vueuse/core';
import { computed, reactive } from 'vue';

const friendIds = useLocalStorage('friend-list', new Set<string>(), {
  serializer: {
    read: (rawArr: string) => new Set(JSON.parse(rawArr)),
    write: (set: Set<string>) => JSON.stringify([...set]),
  },
});

export const friends = computed(() =>
  [...friendIds.value].map((friendId) => ({
    id: friendId,
    highlight: highlighted.has(friendId),
  }))
);

export function addFriend(friendId: string): void {
  friendIds.value.add(friendId);
  highlighted.add(friendId);
  setTimeout(() => highlighted.delete(friendId), 150);
}

export function removeFriend(friendId: string): void {
  friendIds.value.delete(friendId);
}

const highlighted = reactive(new Set<string>());
