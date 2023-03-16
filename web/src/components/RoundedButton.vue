<template>
  <button id="button">
    <v-icon v-if="icon" color="#333333" :icon="icon" size="small" />
    <p v-if="value">{{ value }}</p>
  </button>
</template>

<style lang="scss" scoped>
#button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 50px;
  background: #ffffff;
  font-size: 14px;
  font-weight: bold;
  border: 1.5px solid #e0e0e0;
  width: fit-content;
  height: fit-content;
}
</style>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  icon: String,
  value: String,
});
</script>
