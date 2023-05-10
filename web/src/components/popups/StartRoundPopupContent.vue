<template>
  <!-- Popup containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
  <card-popup v-model="show" title="Start ronde" prepend-icon="mdi-alert">
    <p class="mx-3 mb-3">
      Je staat op het punt een ronde te starten. Het huidige tijdstip zal
      opgeslagen worden als start tijdstip. Ben je zeker dat je de ronde wilt
      starten?
    </p>

    <template v-slot:actions>
      <v-spacer />
      <v-btn id="start" color="success" @click="onsubmit" variant="elevated">
        Start ronde
      </v-btn>
      <v-btn id="cancel" @click="oncancel" color="error" class="mr-3" variant="elevated">
        Annuleer
      </v-btn>
    </template>
  </card-popup>
</template>
<script lang="ts" setup>
import CardPopup from "@/components/popups/CardPopup.vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  oncancel: { type: Function, required: true },
  onsubmit: { type: Function, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const show = computed({
  get() {
    return props.modelValue;
  },
  set(show) {
    emit("update:modelValue", show);
  },
});
</script>
