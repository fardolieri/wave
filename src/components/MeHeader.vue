<script setup lang="ts">
import { copyToClipboard } from 'src/utils/copy-to-clipboard';
import { mediaStream, requestMediaStream } from 'src/utils/media-stream';
import { serializedPublicKey } from 'src/core/security';
import { myUsername } from 'src/core/username';
import JdentIcon from './JdentIcon.vue';

defineEmits<{ (e: 'toggle-left-drawer'): void }>();

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
        aria-label="Open drawer"
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

      <div class="text-subtitle1 q-mr-sm user-select-none">
        {{ myUsername }}
      </div>
      <q-avatar class="q-mr-xs">
        <jdent-icon :hash="serializedPublicKey"></jdent-icon>
      </q-avatar>
      <q-btn icon="more_vert" :ripple="false" dense round flat>
        <q-menu auto-close :offset="[110, 0]">
          <q-list separator style="min-width: 150px">
            <q-item clickable @click="copyToClipboard(serializedPublicKey)">
              <q-item-section>
                <q-item-label>Copy own peer ID </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="commitHash" @click.prevent>
              <q-item-section style="width: 200px">
                <q-item-label>Commit</q-item-label>
                <q-item-label caption class="ellipsis text-grey">{{
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
