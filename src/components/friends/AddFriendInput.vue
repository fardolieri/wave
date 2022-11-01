<template>
  <q-input
    rounded
    outlined
    dense
    class="WAL__field full-width"
    v-model="text"
    placeholder="Paste your friend's peer ID"
    @update:modelValue="onInput($event as string)"
  >
    <template v-slot:prepend>
      <q-icon name="person_add" class="q-mr-xs" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { addFriend } from './friends';

const text = ref('');

function onInput(value: string): void {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  const id = uuidRegex.exec(value)?.[0];

  if (id) {
    setTimeout(() => {
      addFriend(id);
      text.value = '';
    }, 0);
  }
}
</script>
