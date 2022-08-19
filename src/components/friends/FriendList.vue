<template>
  <q-scroll-area style="height: calc(100% - 100px)">
    <q-list>
      <transition-group
        enter-active-class="animated lightSpeedInRight"
        leave-active-class="animated lightSpeedOutRight"
      >
        <q-item
          v-for="friend in reverseFriendList"
          :key="friend.id"
          :class="{ highlight: friend.highlight }"
        >
          <q-item-section avatar>
            <q-avatar>
              <jdent-icon :hash="friend.id"></jdent-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" style="text-overflow: ellipsis; width: 5em">
              {{ friend.id }}
            </q-item-label>
            <q-item-label class="conversation__summary" caption>
              <q-icon name="check" />
              caption
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_down" style="cursor: pointer" />
            <q-menu auto-close :offset="[-18, -8]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>Edit Name</q-item-section>
                </q-item>
                <q-item
                  clickable
                  @click="$navigator.clipboard.writeText(friend.id)"
                >
                  <q-item-section>Copy peer ID</q-item-section>
                </q-item>
                <q-separator class="q-my-xs"></q-separator>
                <q-item clickable>
                  <q-item-section @click="removeFriend(friend.id)"
                    >Remove</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-item-section>
        </q-item>
      </transition-group>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JdentIcon from '../JdentIcon.vue';
import { friends, removeFriend } from './friends';

const reverseFriendList = computed(() => [...friends.value].reverse());
</script>

<style lang="sass" scoped>
.highlight
  background-color: #ffffff3d
</style>
