<template>
  <!--
        Put whitespace left and right of the content,
        But only when the screen is broad enough
    -->
  <v-row>
    <HFill />
    <v-col style="min-width: 65%" :class="margin">
      <slot></slot>
    </v-col>
    <HFill />
  </v-row>
</template>
<script setup lang="ts">
import HFill from "@/components/HFill.vue";

defineProps({
  margin: { type: String, default: "ma-3" },
});
</script>
