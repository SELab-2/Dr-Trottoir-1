<template>
  <v-overlay v-model="show" class="d-flex align-center justify-center">
    <CardLayout v-bind="{ ...$attrs }">
      <!-- Pass all the slots -->
      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
      </template>
    </CardLayout>
  </v-overlay>
</template>
<script lang="ts" setup>
import CardLayout from "@/layouts/CardLayout.vue";

/**
 * This component will popup in the center of the screen.
 * Internally it is a CardLayout, so you can pass all the v-card props
 * <CardPopup v-model="show"/>
 * where 'show' is an the boolean state to show the popup or not
 */

import { computed } from "vue";
// use v-model
// https://vuejs.org/guide/components/v-model.html
const props = defineProps({
  modelValue: Boolean,
  width: { type: Number, default: 320 },
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
