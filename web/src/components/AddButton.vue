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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  icon: String,
  size: {
    type: String,
    default: "x-large",
  },
  items: Array,
});
</script>

<style lang="scss" scoped>
.addButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
