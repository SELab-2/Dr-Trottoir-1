<template>
  <div class="ma-4">
    <v-text-field
      v-model="email"
      label="E-mail"
      type="text"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Wachtwoord"
      type="text"
      required
    ></v-text-field>

    <v-btn
      prepend-icon="mdi-login"
      color="success"
      @click="() => useAuthStore().logIn(email, password)"
      >Login</v-btn
    >

    <pre id="json" class="py-4">{{
      JSON.stringify(
        useAuthStore().auth ?? { message: "Not authenticated" },
        null,
        4,
      )
    }}</pre>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";

const email = ref("");
const password = ref("");
</script>
