<template>
  <div class="WAL position-relative" :style="style">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <me-header
        @toggle-left-drawer="toggleLeftDrawer"
        class="bg-dark-alt-2"
      ></me-header>

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
          <add-friend-input></add-friend-input>
        </q-toolbar>

        <friends-list></friends-list>
      </q-drawer>

      <q-page-container class="dark-transparent">
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
import AddFriendInput from 'src/components/friends/AddFriendInput.vue';
import FriendsList from 'src/components/friends/FriendList.vue';
import MeHeader from 'src/components/MeHeader.vue';
import { computed, ref } from 'vue';

const $q = useQuasar();

const leftDrawerOpen = ref(false);
const message = ref('');

const style = computed(() => ({
  height: $q.screen.height + 'px',
}));

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="sass">
.dark-transparent
  background-color: #303b4cd4

.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px

  &__layout
    margin: 0 auto
    z-index: 4000
    height: 100%
    width: 90%
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

.q-menu.q-dark
  background-color: $dark-alt
</style>
