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
        <q-scroll-area style="height: 340px" visible class="scroll-blur">
          <q-infinite-scroll :offset="750" @load="loadMoreAvatars">
            <div class="icon-flex-container">
              <jdent-icon
                v-for="key in keys"
                :key="key.serializedPublicKey"
                :hash="key.serializedPublicKey"
                @click="onAvatarClick(key)"
              ></jdent-icon>
            </div>
            <template v-slot:loading>
              <div class="row justify-center">
                <q-spinner-dots color="primary" size="lg" /></div
            ></template>
          </q-infinite-scroll>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { QInput } from 'quasar';
import { useDialogPluginComponent } from 'quasar';
import type { Key } from 'src/utils/key';
import { newKeyPair } from 'src/utils/key';
import { nextTick, ref } from 'vue';
import JdentIcon from './JdentIcon.vue';

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();
defineEmits({ ...useDialogPluginComponent.emitsObject });

const keys = ref<Key[]>([]);

const usernameRef = ref<QInput>();
const username = ref('');

function newKeys(n: number): Promise<Key[]> {
  return Promise.all([...Array(n)].map(newKeyPair));
}

const loadMoreAvatars = async (index: number, done: () => void) => {
  const newPairs = await newKeys(12);
  keys.value.push(...newPairs);
  done();
};

async function onAvatarClick(key: Key): Promise<void> {
  usernameRef.value?.resetValidation();
  await nextTick();
  const succesfulValidation = await usernameRef.value?.validate();
  if (!succesfulValidation) {
    usernameRef.value?.focus();
    return;
  }

  onDialogOK({
    key,
    username: username.value,
  });
}
</script>

<style lang="sass">
.avatar-picker
  .icon-flex-container
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))

    & .jdent-icon
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
