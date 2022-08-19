import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $console: typeof console;
    $navigator: typeof navigator;
  }
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.config.globalProperties.$console = console;
  app.config.globalProperties.$navigator = navigator;
});
