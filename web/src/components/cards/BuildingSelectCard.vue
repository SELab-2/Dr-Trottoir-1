<template>
  <BorderCard class="my-2">
    <template v-slot:prepend>
      <v-icon icon="mdi-office-building"></v-icon>
    </template>
    <template v-slot:title>{{ name }}</template
    ><template v-slot:subtitle>{{ address }}</template>
    <template v-slot:append>
      <v-icon
        @click="$emit('up')"
        class="mx-1"
        color="primary"
        icon="mdi-chevron-up"
      />
      <v-icon
        @click="$emit('down')"
        class="mx-1"
        color="primary"
        icon="mdi-chevron-down"
      />
      <v-icon
        @click="$emit('remove')"
        class="mx-1"
        color="error"
        icon="mdi-close"
      />
    </template>
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";

defineProps({
  name: { type: String, required: true },
  address: { type: String, required: true },
});
</script>

<style scoped>
td {
  border-right: solid 1px rgb(216, 216, 216);
  border-left: solid 1px rgb(216, 216, 216);
}
</style>
