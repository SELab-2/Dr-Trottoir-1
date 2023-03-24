<template>
  <v-btn @click="this.$router.push({name: 'Gebouw detail', params: { id: 5, date: new Date()}});"></v-btn>
</template>

<script lang="ts" setup>
// TODO: mockdata, remove in future
const buildings: string[] = [
  "Eiffeltoren",
  "Taj Mahal",
  "Machu Picchu",
  "Piramide",
  "Atomium",
  "Toren van Pisa",
];

</script>

<style scoped lang="scss">
</style>
