<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

/**
 * A helper that lets us use 'material-icons' (no prefix) names
 * although we want 'material-symbols-outlined' (same as
 * material-icons but prefixed with 'sym_o_').
 */
$q.iconMapFn = (iconName) => ({ icon: `sym_o_${iconName}` });
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48;
}
</style>
