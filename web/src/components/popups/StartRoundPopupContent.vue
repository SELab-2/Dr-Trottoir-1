<template>
  <!-- Popup containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
  <card-popup v-model="show">
    <div class="pa-4" style="max-width: 400px">
      <div class="d-flex align-center" style="gap: 12px">
        <v-icon icon="mdi-alert" size="large"></v-icon>
        <h2>Start ronde</h2>
      </div>
      <p style="opacity: 90%" class="pt-2 pb-4">
        Je staat op het punt een ronde te starten. Het huidige tijdstip zal
        opgeslagen worden als start tijdstip. Ben je zeker dat je de ronde wilt
        starten?
      </p>

      <div
        style="
          display: grid;
          gap: 12px;
          min-width: fit-content;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        "
      >
        <v-btn id="start" color="success" @click="onsubmit" variant="elevated">
          Start ronde
        </v-btn>
        <v-btn id="cancel" @click="oncancel" color="error" class="mr-3" variant="elevated">
          Annuleer
        </v-btn>
      </div>
    </div>
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
