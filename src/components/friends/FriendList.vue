<template>
  <q-scroll-area style="height: calc(100% - 100px)">
    <q-list>
      <transition-group
        enter-active-class="animated lightSpeedInRight"
        leave-active-class="animated lightSpeedOutRight"
      >
        <q-item
          v-for="friend of contacts"
          :key="friend.id"
          :class="{ 'animated pulse highlight': friend.reactive.highlight }"
        >
          <q-item-section avatar>
            <q-avatar>
              <jdent-icon :hash="friend.id"></jdent-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" style="text-overflow: ellipsis; width: 5em">
              {{ friend.reactive.username ?? friend.id }}
            </q-item-label>
            <q-item-label caption>
              <span
                class="text-grey"
                v-if="friend.reactive.status === 'outgoing friend request'"
              >
                Pending
              </span>
              <span
                class="text-primary"
                v-else-if="friend.reactive.status === 'incoming friend request'"
                >Friend Request</span
              >
              <span class="text-positive" v-else-if="friend.reactive.connected">
                <q-icon name="check" color="positive" />
                Connected
              </span>
              <span class="text-grey" v-else> Not connected </span>
            </q-item-label>
          </q-item-section>
          <q-item-section side v-if="friend.reactive.status === 'friend'">
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
                  <q-item-section @click="friend.remove()"
                    >Remove</q-item-section
                  >
                </q-item>
                <q-item>
                  <q-item-section>{{
                    friend.connection?.connectionId
                  }}</q-item-section>
                </q-item>
                <q-item clickable @click="friend.connection!.send('Hello')">
                  <q-item-section>Send Hello</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item-section>

          <q-item-section
            side
            v-else-if="friend.reactive.status === 'incoming friend request'"
          >
            <q-btn-group push>
              <q-btn
                push
                size="sm"
                color="positive"
                icon="done"
                @click="friend.acceptFriendRequest()"
              >
                <q-tooltip>Accpet</q-tooltip>
              </q-btn>
              <q-btn
                dense
                push
                size="sm"
                color="negative"
                icon="close"
                @click="friend.remove()"
              >
                <q-tooltip>Decline</q-tooltip></q-btn
              >
            </q-btn-group>
          </q-item-section>
          <q-item-section
            side
            v-else-if="friend.reactive.status === 'outgoing friend request'"
          >
            <q-btn
              flat
              size="sm"
              color="grey"
              icon="cancel"
              @click="friend.remove()"
            >
              <q-tooltip>Cancel</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </transition-group>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import JdentIcon from '../JdentIcon.vue';
import { contacts } from './friends';
</script>

<style lang="sass" scoped>
.q-item
  background-color: transparent
  transition: background-color 2000ms ease-in-out

.highlight
  background-color: #ffffff3d
  transition: background-color 150ms ease-in-out
</style>
