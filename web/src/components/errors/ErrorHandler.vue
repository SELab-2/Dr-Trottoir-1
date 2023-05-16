<template>
  <v-overlay
    v-model="useErrorStore().errors.length"
    class="d-flex align-center justify-center"
  >
    <BorderCard
      title="Er ging iets mis"
      prepend-icon="mdi-exclamation-thick"
      max-width="360px"
      width="360px"
      class="mx-2 my-2"
    >
      <BorderCard class="mx-5 my-1">
        <!-- Give list of errors if there is one to the handler which will parse them to a good format-->
        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="(e, i) of useErrorStore().errors"
            :key="i"
            :title="`Code: ${e.error['code'] ?? 503} - ${e.error.name}`"
            :text="e.error.message"
          >
          </v-expansion-panel>
        </v-expansion-panels>
      </BorderCard>
      <v-card-actions class="my-1">
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
  </v-overlay>
</template>

<script lang="ts" setup>
import { useErrorStore } from "@/stores/error";
import BorderCard from "@/layouts/CardLayout.vue";
</script>
