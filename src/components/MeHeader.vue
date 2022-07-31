<script setup lang="ts">
import { computed } from 'vue';
import { csId } from 'src/composables/use-id.js';

defineEmits<{ (e: 'toggle-left-drawer'): void }>();

const avatarUrl = computed(
  () => `https://robohash.org/${csId.value}.png?set=set4`
);
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

      <q-btn round flat>
        <q-avatar>
          <q-img :src="avatarUrl" />
        </q-avatar>
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
