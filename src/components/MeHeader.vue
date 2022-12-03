<script setup lang="ts">
import { debouncedRef } from '@vueuse/shared';
import { copyToClipboard } from 'src/utils/copy-to-clipboard';
import { mediaStream, requestMediaStream } from 'src/utils/media-stream';
import { peerId, peerIsLoading } from 'src/utils/peer';
import JdentIcon from './JdentIcon.vue';

defineEmits<{ (e: 'toggle-left-drawer'): void }>();

// Debounced so it doesn't flicker which would result in a bad UX
const debouncedLoadingIndicator = debouncedRef(peerIsLoading, 500);

const commitHash = process.env.COMMIT_HASH;
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

      <q-btn
        v-if="!mediaStream"
        flat
        label="Start Screenshare"
        icon="screen_share"
        class="text-grey-4"
        @click="requestMediaStream"
      ></q-btn>
      <q-btn
        v-else
        flat
        label="Stop Screenshare"
        icon="stop_screen_share"
        class="text-grey-4"
        @click="mediaStream = undefined"
      ></q-btn>

      <q-space />

      <q-btn round flat>
        <q-avatar>
          <jdent-icon :hash="peerId"></jdent-icon>
        </q-avatar>
        <q-spinner-oval
          v-if="debouncedLoadingIndicator"
          size="2em"
          style="position: absolute; opacity: 0.5"
        ></q-spinner-oval>
        <q-menu auto-close :offset="[110, 0]">
          <q-list style="min-width: 150px">
            <q-item clickable @click="copyToClipboard(peerId)">
              <q-item-section>Copy own peer ID</q-item-section>
            </q-item>
            <q-item
              v-if="commitHash"
              clickable
              @click="copyToClipboard(commitHash!)"
            >
              <q-item-section style="width: 200px">
                <q-item-label>Commit</q-item-label>
                <q-item-label caption class="ellipsis">{{
                  commitHash
                }}</q-item-label>
              </q-item-section>
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

.ellipsis
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>
