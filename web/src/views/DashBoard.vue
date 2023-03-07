<template>
  <!-- Pick a role to view the webpage as -->
  <div class="d-flex align-center flex-column bg-grey-lighten-4 pa-6">
    <h2>Select your current role: </h2>
    <v-btn-toggle divided>
      <v-btn @click="setStudent">Student</v-btn>
      <v-btn @click="setSuperStudent">Superstudent</v-btn>
      <v-btn @click="setSyndicus">Syndicus</v-btn>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts" setup>

import { auth } from '@/scripts/auth'

// Functions to set these roles right now
// TODO: these should be replaced by propper authentication in the future
function setStudent() {
  auth.isLoggedin = true;
  auth.roles.superstudent = false;
  auth.roles.syndicus = false;
}

function setSuperStudent() {
  auth.isLoggedin = true;
  auth.roles.superstudent = true;
  auth.roles.syndicus = false;
}

function setSyndicus() {
  auth.isLoggedin = true;
  auth.roles.superstudent = false;
  auth.roles.syndicus = true;
}
</script>
