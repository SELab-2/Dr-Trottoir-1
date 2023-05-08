<template>
  <!-- Text input field for the house number -->
  <v-text-field
    v-model="homeNumber"
    label="Huisnummer"
    :type="readonly ? 'text' : 'number'"
    required
    :variant="readonly ? 'plain' : 'outlined'"
    :readonly="readonly"
    :rules="numberRules"
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

const numberRules = [
  // check if number is present
  (num: string) => {
    return num ? true : "Geef een huisnummer.";
  },
];
</script>
