<script setup lang="ts">
import { whenever } from '@vueuse/shared';
import { contacts } from 'src/core/friends';
import { copyToClipboard } from 'src/utils/copy-to-clipboard';
import { computed, ref } from 'vue';
import JdentIcon from '../JdentIcon.vue';

const ignoreList = computed(() =>
  contacts.value.filter((contact) => contact.status === 'ignore'),
);

const expanded = ref(false);
whenever(
  () => ignoreList.value.length === 0,
  () => (expanded.value = false),
);
</script>

<template>
  <q-expansion-item
    v-model="expanded"
    dense
    header-class="bg-dark-alt q-px-md shadow-3 "
  >
    <template v-slot:header>
      <q-item-section>
        <div class="row q-gutter-sm">
          <span>Ignored</span>
          <span class="text-grey">
            {{ ignoreList.length }}
          </span>
        </div></q-item-section
      >
    </template>
    <div class="q-py-sm">
      <q-list>
        <q-item v-for="contact of ignoreList" :key="contact.id">
          <q-item-section avatar>
            <q-avatar>
              <jdent-icon :hash="contact.id"></jdent-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" style="text-overflow: ellipsis; width: 5em">
              {{ contact.username }}
            </q-item-label>
            <q-item-label caption>
              <div class="text-grey row items-center">
                Ignored
              </div></q-item-label
            >
          </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_down" style="cursor: pointer" />
            <q-menu auto-close :offset="[-18, -8]">
              <q-list style="min-width: 150px">
                <q-item clickable @click="contact.pardon()">
                  <q-item-section>Pardon</q-item-section>
                </q-item>
                <q-item clickable @click="copyToClipboard(contact.id)">
                  <q-item-section>Copy peer ID</q-item-section>
                  <q-item-section avatar
                    ><q-icon name="content_copy"></q-icon
                  ></q-item-section>
                </q-item>
                <q-separator class="q-my-xs"></q-separator>
                <q-item clickable>
                  <q-item-section @click="contact.remove()"
                    >Remove</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-expansion-item>
</template>
