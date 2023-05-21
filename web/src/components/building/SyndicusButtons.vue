<template>
  <SimpleButton
    class="mr-2"
    prepend-icon="mdi-phone"
    @click="clickPhone(phone)"
    color="primary"
    rounded
  >
    {{ phone }}
  </SimpleButton>
  <SimpleButton
    prepend-icon="mdi-mail"
    @click="clickEmail(email)"
    color="primary"
    rounded
  >
    E-mail
  </SimpleButton>
</template>

<script setup lang="ts">
import SimpleButton from "@/components/buttons/SimpleButton.vue";

defineProps({
  phone: String,
  email: String,
  clickPhone: { type: Function, default: () => {} },
  clickEmail: { type: Function, default: () => {} },
});
</script>
