<script setup lang="ts">
import { peerId } from 'src/utils/use-id.js';
import JdentIcon from './JdentIcon.vue';

defineEmits<{ (e: 'toggle-left-drawer'): void }>();

function copyId(): void {
  navigator.clipboard.writeText(peerId.value);
}
</script>

<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        round
        flat
        icon="keyboard_arrow_left"
        class="WAL__drawer-open q-mr-sm"
        @click="$emit('toggle-left-drawer')"
      />

      <q-space />

      <q-btn round flat>
        <q-avatar>
          <jdent-icon :hash="peerId"></jdent-icon>
        </q-avatar>
        <q-menu auto-close :offset="[110, 0]">
          <q-list style="min-width: 150px">
            <q-item clickable @click="copyId">
              <q-item-section>Copy own ID</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<style lang="sass" scoped>
@media (min-width: 691px)
  .WAL
    &__drawer-open
      display: none
</style>
