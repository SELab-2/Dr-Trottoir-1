<template>
  <div class="background">
    <div class="form">
      <!-- Display the Dr. troittoir logo above the login form -->
      <v-img
        class="banner-logo"
        contain
        src="@/assets/images/drtroittoir_logo_black.png"
      ></v-img>
      <br />

      <!-- The input field for the e-mail -->
      <v-text-field
        v-model="email"
        :prepend-inner-icon="'mdi-email'"
        label="E-mail"
        type="text"
        required
      ></v-text-field>

      <!-- The input field for the password -->
      <v-text-field
        v-model="password"
        :prepend-inner-icon="'mdi-lock'"
        :append-inner-icon="showPsswd ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPsswd ? 'text' : 'password'"
        label="Wachtwoord"
        @click:append-inner="showPsswd = !showPsswd"
        bg
      ></v-text-field>
      <!-- Div with help text and login button -->
      <div class="d-flex">
        <!-- Help text for people who don't have an account yet -->
        <p class="me-auto">
          Nog geen account?
          <span @click="snackbar = true" class="clickable-text">
            Contacteer ons.
          </span>
        </p>
        <!-- Login button -->
        <!-- TODO: should link to correct page for which user authenticated, now default student  -->
        <v-btn
          prepend-icon="mdi-login"
          color="success"
          @click="useAuthStore().logIn(email, password)"
          >Login</v-btn
        >
      </div>
    </div>
  </div>

  <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
  <v-snackbar v-model="snackbar" timeout="-1" color="white">
    <v-card prepend-icon="mdi-help" variant="flat">
      <template v-slot:title> Help </template>
      <p class="mx-3">
        Indien je nog geen account hebt en graag lid wilt worden van DR.
        Trottoir neem dan contact op met ons via example@drtrottoir.be
      </p>
      <div class="d-flex flex-row-reverse ma-3">
        <v-btn @click="snackbar = false" color="primary"> Close </v-btn>
      </div>
    </v-card>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

// reactive email state
const email = ref("");

// reactive password state
const password = ref("");

// reactive state to check if the psswd must be shown or not
const showPsswd = ref(false);

// reactive state to check if the snackbar must be shown or not
const snackbar = ref(false);
</script>

<style lang="scss">
// backgroud div. Nedded to center form div
.background {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

// div with input fields. Needed for responsive design
.form {
  width: 600px;
  max-width: 90%;
  padding: 10px;
  align-content: center;
}

// makes the info text look like it's clickable
.clickable-text {
  text-decoration: underline;
  cursor: pointer;
  color: #069;
}
</style>
