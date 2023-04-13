<template>
  <BorderCard class="my-2">
    <template v-slot:title>{{ date }}</template
    ><template v-slot:append>
      <div class="mx-1 pb-5">
        <v-chip class="mr-4" prepend-icon="mdi-clock-time-two-outline">{{
          time
        }}</v-chip>
        <v-icon @click="$emit('remove')" color="error" icon="mdi-close" />
      </div>
    </template>
    <template v-slot:subtitle
      ><Avatar class="mx-1" size="x-small" :name="name" /><v-subtitle>{{
        name
      }}</v-subtitle></template
    >

    <div class="d-flex mb-2 ml-4">
      <v-chip
        v-for="garbage in ['Rest', 'PMD', 'GFT', 'Papier']"
        :key="garbage"
        size="small"
        class="mx-1"
        prepend-icon="mdi-recycle"
        >{{ garbage }}</v-chip
      >
    </div>
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import Avatar from "@/components/Avatar.vue";

defineProps({
  name: String,
  date: String,
  time: String,
  id: String,
});
</script>
