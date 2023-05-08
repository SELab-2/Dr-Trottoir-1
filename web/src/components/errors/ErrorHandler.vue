<template>
  <v-overlay
    @update:model-value="closedDialog()"
    v-model="showDialog"
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
        <ErrorHolder :errors="errors"></ErrorHolder
      ></BorderCard>
      <v-card-actions class="my-1">
        <v-btn @click="retryFunction()" prepend-icon="mdi-rotate-right"
          >Probeer opnieuw</v-btn
        >
        <v-spacer />
        <v-btn @click="closedDialog()" prepend-icon="mdi-close">Sluit</v-btn>
      </v-card-actions>
    </BorderCard>
  </v-overlay>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useErrorStore } from "@/stores/error";
import ErrorHolder from "@/components/errors/ErrorHolder.vue";
import BorderCard from "@/layouts/CardLayout.vue";

const errors = ref<unknown[]>([]);
const showDialog = ref<boolean>(errors.value.length !== 0);

function closedDialog() {
  showDialog.value = false;
  useErrorStore().emptyStore();
}

function retryFunction() {
  showDialog.value = false;
  useErrorStore().retryFunction();
}

watch(useErrorStore().errors, () => {
  showDialog.value = useErrorStore().errors.length !== 0;
  errors.value = useErrorStore().errors;
});
</script>
