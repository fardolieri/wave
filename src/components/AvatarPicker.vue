<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="avatar-picker">
    <q-card style="width: 700px; max-width: 650px; max-height: 90vh">
      <q-card-section>
        <div class="text-h6">Chose your Username and Avatar</div>
        <div class="text-caption">
          Your avatar is coupled to your peer ID so it cannot be changed later.
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          outlined
          ref="usernameRef"
          v-model="username"
          label="Username"
          class="lighter-negative"
          :autofocus="true"
          :rules="[Boolean]"
        ></q-input>
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <q-scroll-area style="height: 330px" visible class="scroll-blur">
          <q-infinite-scroll :offset="750" @load="loadMoreAvatars">
            <div class="icon-flex-container">
              <jdent-icon
                v-for="hash in hashes"
                :hash="hash"
                :key="hash"
                @click="onAvatarClick(hash)"
              ></jdent-icon>
            </div>
          </q-infinite-scroll>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { QInput } from 'quasar';
import { useDialogPluginComponent } from 'quasar';
import { v4 as uuid } from 'uuid';
import { nextTick, ref } from 'vue';
import JdentIcon from './JdentIcon.vue';

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();
defineEmits({ ...useDialogPluginComponent.emitsObject });

const hashes = ref(newHashes(24));

const usernameRef = ref<QInput>();
const username = ref('');

function newHashes(n: number): string[] {
  return [...Array(n)].map(() => uuid());
}

const loadMoreAvatars = (index: number, done: () => void) => {
  hashes.value.push(...newHashes(12));
  done();
};

async function onAvatarClick(hash: string): Promise<void> {
  usernameRef.value?.resetValidation();
  await nextTick();
  const succesfulValidation = await usernameRef.value?.validate();
  if (!succesfulValidation) {
    usernameRef.value?.focus();
    return;
  }

  onDialogOK({ hash, username: username.value });
}
</script>

<style lang="sass">
.avatar-picker
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

  .scroll-blur
    --mask-height: 2em
    --mask-image-filter: linear-gradient(transparent 0, #fff var(--mask-height), #fff calc(100% - var(--mask-height)), transparent 100%)
    -webkit-mask-image: var(--mask-image-filter)
    mask-image: var(--mask-image-filter)

    .q-scrollarea__thumb
      margin-top: 16px
</style>
