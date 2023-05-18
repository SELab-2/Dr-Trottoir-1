<template>
  <v-chip color="border" variant="outlined">
    <v-icon :v-show="icon !== ''" :icon="icon" color="black"/>
    <p class="text-black mx-1">
      {{ text }}
    </p>
  </v-chip>
</template>
<script setup lang="ts">
defineProps({
  icon: {type: String, default: ''},
  text: {default: ''},
})
</script>
