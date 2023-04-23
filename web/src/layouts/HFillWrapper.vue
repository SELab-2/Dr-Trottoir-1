<!--
    Put whitespace left and right of the content,
    But only when the screen is broad enough.
-->
<template>
  <div class="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({ margin: { type: String, default: "ma-3" } });
</script>

<style lang="sass">
.container
  max-width: 800px
  margin: 0 auto
  padding: 0 20px
</style>
