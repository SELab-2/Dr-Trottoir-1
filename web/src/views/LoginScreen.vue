<template>
  <div class="background">
    <div class="form">
      <!-- Display the Dr. troittoir logo above the login form -->
      <v-img contain src="@/assets/images/drtroittoir_logo.png"></v-img>
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
      <div>
        <!-- Help text for people who don't have an account yet -->
        <p class="float-l">
          Nog geen account?
          <span @click="snackbar = true" class="clickable-text">
            Contacteer ons
          </span>
        </p>
        <!-- Login button -->
        <v-btn class="float-r" @click="handleSubmit"> Login </v-btn>
      </div>
    </div>
  </div>

  <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->
  <v-snackbar v-model="snackbar">
    <h1>Help</h1>
    <p>
      TODO: textje voor accountaanmaak en vragen verwijs door naar
      exaple@drtrottoir.be
    </p>
    <v-btn @click="snackbar = false"> Close </v-btn>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// reactive email state
const email = ref("");

// reactive password state
const password = ref("");

// reactive state to check if the psswd must be shown or not
const showPsswd = ref(false);

// reactive state to check if the snackbar must be shown or not
const snackbar = ref(false);

// function that handels the login event
function handleSubmit() {
  console.log("Logging in...");
}
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

// let component live left in it's parent
.float-l {
  float: left;
}

// let component live right in it's parent
.float-r {
  float: right;
}
</style>
