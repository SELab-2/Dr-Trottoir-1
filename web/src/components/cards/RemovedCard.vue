<template>
  <BorderCard v-show="show" prepend-icon="mdi-alert" :title="title">
    <template v-slot:append>
      <v-btn
        id="restore"
        color="success"
        @click="restore()"
        variant="elevated"
        class="text-none"
        prepend-icon="mdi-delete-restore"
      >
        Herstel
      </v-btn>
    </template>
  </BorderCard>
</template>
<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "Herstel" },
  restore: { type: Function, default: () => {} },
});
</script>
