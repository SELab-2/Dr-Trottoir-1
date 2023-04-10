<!--
    Put whitespace left and right of the content,
    But only when the screen is broad enough.
-->
<template>
  <div class="d-flex justify-center">
    <div style="width: 800px" :class="margin">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({ margin: { type: String, default: "ma-3" } });
</script>
