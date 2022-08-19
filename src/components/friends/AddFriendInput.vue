<template>
  <q-input
    rounded
    outlined
    dense
    class="WAL__field full-width"
    v-model="text"
    placeholder="Paste your friend's peer ID"
    @update:modelValue="onInput"
  >
    <template v-slot:prepend>
      <q-icon name="person_add" class="q-mr-xs" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { uuidRegex } from 'src/utils/use-id';
import { ref } from 'vue';
import { addFriend } from './friends';
const text = ref('');

function onInput(value: string | number | null): void {
  const id = typeof value === 'string' ? uuidRegex.exec(value)?.[0] : undefined;
  if (id) {
    setTimeout(() => {
      addFriend(id);
      text.value = '';
    }, 0);
  }
}
</script>
