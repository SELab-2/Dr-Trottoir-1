<template>
  <BorderCard class="my-2">
    <template v-slot:title>{{ date?.toLocaleDateString() }}</template
    ><template v-slot:append>
      <div class="mx-1 pb-5">
        <v-chip class="mr-4" prepend-icon="mdi-clock-time-two-outline">{{
          time
        }}</v-chip>
        <v-icon @click="$emit('remove')" color="error" icon="mdi-close" />
      </div>
    </template>
    <template v-slot:subtitle>
      <div class="d-flex">
        <Avatar class="mx-1" size="x-small" :name="name" /><v-card-subtitle>{{
          name
        }}</v-card-subtitle>
      </div></template
    >
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import Avatar from "@/components/Avatar.vue";

defineProps({
  name: String,
  date: Date,
  time: String,
  id: String,
});
</script>
