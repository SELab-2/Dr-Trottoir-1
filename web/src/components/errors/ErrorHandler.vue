<template>
  <div :hidden="useErrorStore().state === null" class="error-overlay">
    <BorderCard
      :title="title"
      max-width="360px"
      width="360px"
      class="ma-2 pa-2"
    >
      <p class="px-4">{{ useErrorStore().state?.error.message }}</p>
      <v-card-actions>
        <v-btn
          @click="() => useErrorStore().retryFunction()"
          prepend-icon="mdi-rotate-right"
          >Probeer opnieuw</v-btn
        >
        <v-spacer />
        <v-btn
          @click="() => useErrorStore().popError()"
          prepend-icon="mdi-close"
          >Sluit</v-btn
        >
      </v-card-actions>
    </BorderCard>
  </div>
</template>

<script lang="ts" setup>
import { useErrorStore } from "@/stores/error";
import BorderCard from "@/layouts/CardLayout.vue";
import { computed } from "vue";
import { QueryError } from "@selab-2/groep-1-query";

const title = computed(() => {
  const state = useErrorStore().state;

  if (!state) {
    return ""; // Shouldn't be used anyway.
  }

  const { error } = state;

  if (error instanceof QueryError) {
    return `${error.code} - ${error.name}`;
  } else {
    return error.name;
  }
});
</script>

<style lang="sass">
.error-overlay
  position: fixed
  display: flex
  align-items: center
  justify-content: center
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 1001
  background-color: rgba(0, 0, 0, 0.34)
  height: 100vh
  width: 100vw
</style>
