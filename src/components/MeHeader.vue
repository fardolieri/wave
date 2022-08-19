<script setup lang="ts">
import { csId } from 'src/utils/use-id.js';
import JdentIcon from './JdentIcon.vue';

defineEmits<{ (e: 'toggle-left-drawer'): void }>();

function copyId(): void {
  navigator.clipboard.writeText(csId.value);
  const el = document.querySelector('.copy-id-tooltip div');
  el && (el.textContent += ' ✔');
}
</script>

<template>
  <q-header elevated>
    <q-toolbar class="bg-dark">
      <q-btn
        round
        flat
        icon="keyboard_arrow_left"
        class="WAL__drawer-open q-mr-sm"
        @click="$emit('toggle-left-drawer')"
      />

      <q-btn round flat @click="copyId">
        <q-avatar>
          <jdent-icon :hash="csId"></jdent-icon>
        </q-avatar>
        <q-tooltip class="copy-id-tooltip"
          ><div class="text-overline">Copy own ID</div></q-tooltip
        >
      </q-btn>

      <span class="q-subtitle-1 q-pl-md">
        {{ csId }}
      </span>

      <q-space />

      <q-btn round flat icon="search" />
      <q-btn round flat>
        <q-icon name="attachment" class="rotate-135" />
      </q-btn>
      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 0]" class="bg-dark-0-">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>Contact data</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Block</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Select messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Silence</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Clear messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Erase messages</q-item-section>
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
