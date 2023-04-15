<template>
  <!-- Popup message containing detailed info about account creation. Will pop up when clicked on the text in the bottom div -->

  <v-card prepend-icon="mdi-exclamation" variant="flat" color="background">
    <template v-slot:title> Start ronde </template>
    <p class="mx-3">
      Je staat op het punt een ronde te starten. Het huidige tijdstip zal
      opgeslagen worden als start tijdstip. Ben je zeker dat je de ronde wilt
      starten?
    </p>
    <div class="d-flex flex-row-reverse ma-3">
      <v-btn color="success" @click="onsubmit"> Start ronde </v-btn>
      <v-btn @click="oncancel" color="error" class="mr-3"> Annuleer </v-btn>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
defineProps({
  oncancel: { type: Function, required: true },
  onsubmit: { type: Function, required: true },
});
</script>
