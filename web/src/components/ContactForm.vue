<template>
  <v-list density="compact">
    <v-text-field
      prepend-inner-icon="mdi-phone"
      label="Telefoon nummer"
      v-model="contact.phone"
      :variant="readonly ? 'plain' : 'filled'"
      :readonly="readonly"
      @update:model-value="$emit('onUpdate', contact)"
    ></v-text-field>
    <v-text-field
      prepend-inner-icon="mdi-email"
      label="e-mail"
      v-model="contact.email"
      :variant="readonly ? 'plain' : 'filled'"
      :readonly="readonly"
      @update:model-value="$emit('onUpdate', contact)"
    ></v-text-field>
  </v-list>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Contact from "@/components/models/Contact";

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
});

const contact = ref<Contact>({
  phone: props.phone,
  email: props.email,
});
</script>
