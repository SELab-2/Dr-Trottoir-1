<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import { ref } from "vue";
import { JoiPasswordExtend, joiPasswordExtendCore } from "joi-password";
import Joi from "joi";

const joiPassword: JoiPasswordExtend = Joi.extend(joiPasswordExtendCore);

const spacing: String = "mx-5";

const password = ref("");
const passwordRepeat = ref("");
const hidden = ref(false);

const emit = defineEmits(["password", "passwordRepeat"]);

const passwordValidator = joiPassword
  .string()
  .trim()
  .min(8) // minimum of 8 characters
  .minOfNumeric(1) // at least one numberic character
  .minOfUppercase(1) // at least one uppercase character
  .minOfSpecialCharacters(1)
  .messages({
    "string.empty": "Wachtwoord mag niet leeg zijn!",
    "password.minOfUppercase":
      "Wachtwoord moet minstens {#min} hoofdletters bevatten",
    "password.minOfSpecialCharacters":
      "Wachtwoord moet minstens {#min} speciale karakter bevatten",
    "password.minOfNumeric": "Wachtwoord moet minstens 1 getal bevatten",
    "string.min": "Wachtwoord moet minstens {#limit} karakters lang zijn",
  });
const validPassword = (password: string) => {
  const { error, _ } = passwordValidator.validate(password);
  return error === undefined ? true : error.message;
};

const passwordRules = [
  validPassword,
  () => {
    emit("password", password.value);
    return true;
  },
];

const passwordRepeatRules = [
  validPassword,
  () => {
    return password.value === passwordRepeat.value
      ? true
      : "Wachtwoorden moeten overeenkomen";
  },
  () => {
    emit("passwordRepeat", passwordRepeat.value);
    return true;
  },
];
</script>

<template>
  <BorderCard class="mt-4" prepend-icon="mdi-lock">
    <template v-slot:title> Wachtwoord</template>
    <v-list density="compact" :class="spacing">
      <v-text-field
        class="mt-2"
        v-model="password"
        :prepend-inner-icon="'mdi-lock'"
        :append-inner-icon="hidden ? 'mdi-eye' : 'mdi-eye-off'"
        :type="hidden ? 'text' : 'password'"
        :counter="8"
        :rules="passwordRules"
        label="Wachtwoord"
        hint="Wachtwoorden bestaan minstens uit 1 getal, 1 hoofdletter en 1 speciaal karakter."
        @click:append-inner="hidden = !hidden"
        bg
      ></v-text-field>
      <!-- Text input field for the password confirmation-->
      <v-text-field
        class="mt-2"
        v-model="passwordRepeat"
        :prepend-inner-icon="'mdi-lock'"
        :append-inner-icon="hidden ? 'mdi-eye' : 'mdi-eye-off'"
        :type="hidden ? 'text' : 'password'"
        :counter="8"
        :rules="passwordRepeatRules"
        label="Bevestig wachtwoord"
        @click:append-inner="hidden = !hidden"
        bg
      ></v-text-field>
    </v-list>
  </BorderCard>
</template>

<style scoped lang="sass"></style>
