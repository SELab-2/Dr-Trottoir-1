<template>
  <v-btn
    class="text-none mr-2"
    prepend-icon="mdi-phone"
    @click="clickPhone(phone)"
    color="primary"
    rounded
  >
    {{ phone }}
  </v-btn>
  <v-btn
    class="text-none"
    prepend-icon="mdi-mail"
    @click="clickEmail(email)"
    color="primary"
    rounded
  >
    E-mail
  </v-btn>
</template>

<script setup lang="ts">
defineProps({
  phone: String,
  email: String,
  clickPhone: { type: Function, default: () => {} },
  clickEmail: { type: Function, default: () => {} },
});
</script>
