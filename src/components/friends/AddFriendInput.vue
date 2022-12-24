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
import { base33endingChar } from 'src/utils/base33';
import { ref } from 'vue';
import { contacts, newContact } from './friends';

const text = ref('');

function clearText(): void {
  setTimeout(() => {
    text.value = '';
  }, 0);
}

async function onInput(value: string): Promise<void> {
  if (value.endsWith(base33endingChar)) {
    clearText();
    const contactFound = contacts.value.find((friend) => friend.id === value);

    if (contactFound) {
      contactFound.highlight = true;
      setTimeout(() => (contactFound.highlight = false), 150);
      return;
    }

    contacts.value = [
      await newContact(value, 'outgoing friend request'),
      ...contacts.value,
    ];
  }
}
</script>
