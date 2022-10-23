<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 700px; max-width: 650px; max-height: 90vh">
      <q-card-section>
        <div class="text-h6">Chose your avatar</div>
        <div class="text-caption">
          Your avatar is coupled to your peer ID so it cannot be changed without
          reseting your friend's list.
        </div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area style="height: 300px">
          <q-infinite-scroll @load="loadMoreAvatars">
            <div class="icon-flex-container">
              <jdent-icon
                v-for="hash in hashes"
                :hash="hash"
                :key="hash"
                @click="onDialogOK(hash)"
              ></jdent-icon>
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import JdentIcon from './JdentIcon.vue';
import { v4 as uuid } from 'uuid';
import { useDialogPluginComponent } from 'quasar';

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();
defineEmits({ ...useDialogPluginComponent.emitsObject });

const hashes = ref(newHashes(24));

function newHashes(n: number): string[] {
  return [...Array(n)].map(() => uuid());
}

const loadMoreAvatars = (index: number, done: () => void) => {
  hashes.value.push(...newHashes(12));
  done();
};
</script>

<style lang="sass" scoped>
.icon-flex-container
  display: flex
  flex-direction: row
  flex-wrap: wrap
  align-content: flex-start
  justify-content: space-around
  max-width: 600px
  border-radius: 10px

  & .jdent-icon
    width: 150px
    height: 150px
    flex: 1 0 auto
    cursor: pointer
    border-radius: 50%
    cursor: pointer

    &:hover
      filter: drop-shadow(0 0 1em #abababaa)
      padding: 5px
</style>
