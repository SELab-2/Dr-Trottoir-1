<template>
  <button
    id="button"
    @click="
      {
        route();
        $emit('clicked');
      }
    "
  >
    <v-icon v-if="icon" color="#333333" :icon="icon" size="small" />
    <p v-if="value" style="text-overflow: ellipsis; white-space: nowrap">
      {{ value }}
    </p>
    <v-icon
      v-if="props.route"
      color="#333333"
      icon="mdi-chevron-right"
      size="small"
    />
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
import router from "@/router";

const props = defineProps({
  icon: String,
  value: String,
  route: String,
  params: Object,
});

function route() {
  if (props.route) {
    router.push({ name: props.route, params: props.params });
  }
}
</script>
