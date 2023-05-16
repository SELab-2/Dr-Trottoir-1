<template>
  <!-- Text input field for the house number -->
  <v-text-field
    v-model="homeNumber"
    label="Post code"
    :type="readonly ? 'text' : 'number'"
    required
    :variant="readonly ? 'plain' : 'outlined'"
    :readonly="readonly"
    :rules="zipRules"
  ></v-text-field>
</template>
<script lang="ts" setup>
/*
 * The home number can be passed to this component using the v-model.
 * */
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: String, required: true },
  readonly: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const homeNumber = computed({
  get() {
    return props.modelValue;
  },
  set(show) {
    emit("update:modelValue", show);
  },
});

const zipRules = [
  // check if zip is present
  (zip: string) => {
    return zip ? true : "Geef een postcode.";
  },

  // check if zip length is 4
  (zip: string) => {
    return zip.length === 4 ? true : "Ongeldige postcode";
  },
];
</script>
