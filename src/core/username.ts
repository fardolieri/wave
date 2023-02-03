import { useLocalStorage } from '@vueuse/core';

export const myUsername = useLocalStorage<string>('username', '');
