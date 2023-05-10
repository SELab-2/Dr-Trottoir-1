<template>
  <v-btn
    :icon="icon"
    color="primary"
    class="addButton"
    :size="size"
    id="menu-activator"
  />
  <v-menu activator="#menu-activator" location="top">
    <v-card :title="title">
      <v-list class="ml-4 pt-0">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
          @click="item.clicked"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import Button from "@/components/models/Button";

defineProps({
  icon: String,
  size: {
    type: String,
    default: "x-large",
  },
  items: Array<Button>,
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.addButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
