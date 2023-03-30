<!-- Component to place left and right of content, 
    depending on the screen width, the content will not take the full width.
-->
<template>
  <v-col
    v-if="screen.mdAndUp.value"
    cols="1"
    class="flex-grow-1 flex-shrink-0"
    style="max-width: 100%"
  >
  </v-col>
</template>
<script setup lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";
// the screen constant
const screen = useDisplay();
</script>
