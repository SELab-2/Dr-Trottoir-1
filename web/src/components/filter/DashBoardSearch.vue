<template>
  <div class="d-flex align-center box">
    <v-icon icon="mdi-magnify" class="mx-2" size="x-large"></v-icon>
    <v-text-field
      id="search"
      class="w-100"
      label="Zoek in de tabel"
      v-model="searchString"
      @update:model-value="$emit('changed', checked, searchString)"
      variant="underlined"
    />
    <v-checkbox
      id="hidden"
      v-if="admin"
      class="mt-4 checkbox"
      label="Verborgen"
      v-model="checked"
      @update:model-value="$emit('changed', checked, searchString)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
defineProps({
  admin: Boolean,
});

const searchString = ref<string>("");
const checked = ref<boolean>(false);

defineEmits(["changed"]);
</script>

<style scoped lang="scss">
.checkbox {
  width: 150px;
}
.box {
  height: 50px;
}
</style>
