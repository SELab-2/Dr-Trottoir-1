<template>
  <!--
        Put whitespace left and right of the content,
        But only when the screen is broad enough
    -->
  <v-row>
    <HFill />
    <v-col style="min-width: 65%" class="ma-3">
      <slot></slot>
    </v-col>
    <HFill />
  </v-row>
</template>
<script setup lang="ts">
import HFill from "@/components/HFill.vue";
</script>
