<template>
  <p class="badge">{{ props.value }}</p>
</template>

<script setup lang="ts">
const props = defineProps({
  value: Number,
});
</script>

<style scoped lang="sass">
.badge
  color: white
  background-color: #e32626
  border-radius: 9999px
  width: 20px
  height: 20px
  font-size: 12px
  font-weight: 700
  display: flex
  align-items: center
  justify-content: center
</style>
