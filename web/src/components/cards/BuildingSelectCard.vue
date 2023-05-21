<template>
  <BorderCard class="my-2">
    <template v-slot:prepend>
      <v-icon icon="mdi-office-building"></v-icon>
    </template>
    <template v-slot:title>{{ name }}</template
    ><template v-slot:subtitle>{{ address }}</template>
    <template v-slot:append>
      <v-icon
        id="up"
        @click="$emit('up')"
        class="mx-1"
        color="primary"
        icon="mdi-chevron-up"
      />
      <v-icon
        id="down"
        @click="$emit('down')"
        class="mx-1"
        color="primary"
        icon="mdi-chevron-down"
      />
      <v-icon
        id="remove"
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
