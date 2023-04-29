<template>
  <BorderCard @click="$emit('clicked')" class="my-2">
    <template v-slot:prepend>
      <v-icon icon="mdi-office-building"></v-icon>
    </template>
    <template v-slot:title>{{ name }}</template
    ><template v-slot:subtitle>{{ address }}</template>
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";

defineProps({
  name: String,
  address: String,
  id: String,
});
</script>
