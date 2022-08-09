<template>
  <div class="WAL position-relative" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <me-header @toggle-left-drawer="toggleLeftDrawer"></me-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above :breakpoint="690">
        <q-toolbar>
          <div
            class="text-h6"
            style="font-family: sans-serif; user-select: none"
          >
            WΛVE
          </div>

          <q-space />

          <q-btn round flat icon="message" />
          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable>
                  <q-item-section>New group</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Archived</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Favorites</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn
            round
            flat
            icon="close"
            class="WAL__drawer-close"
            @click="toggleLeftDrawer"
          />
        </q-toolbar>

        <q-toolbar>
          <q-input
            rounded
            outlined
            dense
            class="WAL__field full-width"
            v-model="search"
            placeholder="Search or start a new conversation"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar>

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              v-for="(conversation, index) in conversations"
              :key="conversation.csId"
              clickable
              v-ripple
              @click="setCurrentConversation(index)"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img
                    :src="`https://robohash.org/${conversation.csId}.png?set=set4`"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label
                  lines="1"
                  style="text-overflow: ellipsis; width: 5em"
                >
                  {{ conversation.csId }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  <q-icon name="check" />
                  caption
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label caption> 17:00 </q-item-label>
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="bg-dark">
        <router-view />
      </q-page-container>

      <q-footer>
        <q-toolbar class="row bg-dark-alt">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input
            rounded
            outlined
            dense
            class="WAL__field col-grow q-mr-sm"
            v-model="message"
            placeholder="Type a message"
          />
          <q-btn round flat icon="mic" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed } from 'vue';
import MeHeader from 'src/components/MeHeader.vue';

const conversations = [
  { csId: '08fb9637-05e4-4e21-9f73-28ab236b7071' },
  { csId: '08fb9637-05e4-4e21-9f73-28ab236b7072' },
  { csId: '08fb9637-05e4-4e21-9f73-28ab236b7073' },
  { csId: '08fb9637-05e4-4e21-9f73-28ab236b7074' },
];

const $q = useQuasar();

const leftDrawerOpen = ref(false);
const search = ref('');
const message = ref('');
const currentConversationIndex = ref(0);

const style = computed(() => ({
  height: $q.screen.height + 'px',
}));

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setCurrentConversation(index: number) {
  currentConversationIndex.value = index;
}
</script>

<style lang="sass">
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  background-image: url("./background.svg") !important
  background-size: cover

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
    max-width: 1400px
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

  .q-drawer--standard
    .WAL__drawer-close
      display: none

@media (max-width: 1400px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
