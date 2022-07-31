import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';

export const csId = useLocalStorage('id', () => uuid());
