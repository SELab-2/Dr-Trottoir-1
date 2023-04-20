<template>
  <!-- Section to pick the roles -->
  <v-row class="ml-1 mb-0">
    <v-col>
      <v-checkbox
        v-model="roles"
        label="Student"
        value="Student"
        color="primary"
        density="compact"
        :disabled="props.readonly"
        hide-details
      />
      <v-checkbox
        v-model="roles"
        label="Superstudent"
        value="Superstudent"
        color="primary"
        density="compact"
        :disabled="props.readonly"
        hide-details
      />
    </v-col>
    <v-col>
      <v-checkbox
        v-model="roles"
        label="Syndicus"
        value="Syndicus"
        color="primary"
        density="compact"
        :disabled="props.readonly"
        hide-details
      />
      <v-checkbox
        v-model="roles"
        label="Admin"
        value="Admin"
        color="primary"
        density="compact"
        :disabled="props.readonly"
        hide-details
      />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
/**
 * This component can be used with the v-model
 * <RolesForm v-model="roles"/>
 * where 'roles' is an array of strings
 */

import { computed } from "vue";
// use v-model
// https://vuejs.org/guide/components/v-model.html
const props = defineProps({
  modelValue: { type: Array<string> },
  readonly: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const roles = computed({
  get() {
    return props.modelValue;
  },
  set(roles) {
    emit("update:modelValue", roles);
  },
});
</script>
