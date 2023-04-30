<template>
  <CardPopup
    :title="JSON.stringify(errors[0], Object.getOwnPropertyNames(errors[0]), 2)"
    v-model="showDialog"
    @update:model-value="closedDialog()"
    height="100px"
    width="200px"
    class="text-center"
  >
  <v-card-actions>
    <v-spacer/>
    <v-btn @click="showDialog = false" >Sluit</v-btn>
  </v-card-actions>
  </CardPopup>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useErrorStore } from "@/stores/error";
import CardPopup from "./popups/CardPopup.vue";

const errors = ref<unknown[]>([]);
const showDialog = ref<boolean>(errors.value.length !== 0);

function closedDialog() {
  console.log("closed");
  useErrorStore().emptyStore();
}



watch(useErrorStore().errors, () => {
  showDialog.value = useErrorStore().errors.length !== 0;
});
</script>
