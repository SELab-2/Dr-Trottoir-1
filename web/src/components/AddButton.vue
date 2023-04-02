<template>
  <v-btn
    :icon="icon"
    color="primary"
    class="addButton"
    :size="size"
    id="menu-activator"
  />
  <v-menu activator="#menu-activator" location="top">
    <v-list>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :value="index"
        @click="item.clicked"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import Action from "@/components/models/Action";

interface MenuItem {
  title: string;
  clicked: () => void;
}

interface MenuItem {
  title: string;
  clicked: () => void;
}

defineProps({
  icon: String,
  size: {
    type: String,
    default: "x-large",
  },
  items: Array<MenuItem>,
});
</script>

<style lang="scss" scoped>
.addButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
