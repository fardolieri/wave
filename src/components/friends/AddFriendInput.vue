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
import { Contact, contacts } from './friends';

const text = ref('');

function clearText(): void {
  setTimeout(() => {
    text.value = '';
  }, 0);
}

function onInput(value: string): void {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  const id = uuidRegex.exec(value)?.[0];

  if (id) {
    clearText();
    const contactFound = contacts.value.find((friend) => friend.id === id);

    if (contactFound) {
      contactFound.reactive.highlight = true;
      setTimeout(() => (contactFound.reactive.highlight = false), 150);
      return;
    }

    contacts.value = [
      new Contact(id, 'outgoing friend request'),
      ...contacts.value,
    ];
  }
}
</script>
