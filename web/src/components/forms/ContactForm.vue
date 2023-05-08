<template>
  <v-list class="ma-0 pa-0">
    <v-text-field
      class="mt-2"
      prepend-inner-icon="mdi-phone"
      label="Telefoonnummer"
      v-model="contact.phone"
      :variant="readonly ? 'plain' : 'outlined'"
      :readonly="readonly"
      :rules="phoneRules"
      :counter="9"
      placeholder="0412345678"
      @update:model-value="$emit('onUpdate', contact)"
    ></v-text-field>
    <v-text-field
      class="mt-2 mb-1"
      prepend-inner-icon="mdi-email"
      label="e-mail"
      v-model="contact.email"
      :variant="readonly ? 'plain' : 'outlined'"
      :readonly="readonly"
      :rules="emailRules"
      placeholder="voorbeeld@voorbeeld.com"
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

defineEmits(['onUpdate'])

const contact = ref<Contact>({
  phone: props.phone,
  email: props.email,
});

/* below are the rule checks*/

const phoneRules = [
  // check if phone number is present
  (phone: string) => {
    return phone ? true : "Geef een telefoonnummer op.";
  },
  // check if password is long enough
  (phone: string) => {
    return phone.length >= 9
      ? true
      : "Telefoonnummer moet minimaal 9 tekens lang zijn.";
  },
];

const emailRules = [
  // check if email is present
  (email: string) => {
    return email ? true : "Geef een e-mail adres op.";
  },

  // check for valid email syntax
  (email: string) => {
    return /^.+@.+\..+$/.test(email) ? true : "Ongeldig e-mail adres.";
  },
];
</script>
