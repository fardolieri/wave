import { useLocalStorage } from '@vueuse/core';
import { v4 as uuid } from 'uuid';

export const csId = useLocalStorage('id', () => uuid());

export const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
