import { useLocalStorage } from '@vueuse/core';

export const username = useLocalStorage<string>('username', '');
