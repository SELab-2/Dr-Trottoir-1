<template>
  <img
    alt="banner"
    id="banner"
    src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
  />
  <div id="building-screen" class="px-4">
    <div class="general-info-main">
      <h1 class="building-name">El Paradisio</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap">
        <RoundedButton icon="mdi-map-search" value="Kaarten" />
        <RoundedButton icon="mdi-file-pdf-box" value="Handleiding" />
        <RoundedButton icon="mdi-phone" value="0471234567" />
        <RoundedButton icon="mdi-mail" value="E-mail" />
        <RoundedButton icon="mdi-lock" value="3142" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// TODO: should this really be a class on its own?
import RoundedButton from "@/components/buttons/RoundedButton.vue.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  id: String,
});
</script>

<style lang="scss" scoped>
.general-info-main {
  & > * {
    margin: 10px 0;
  }
}

#banner {
  width: 100%;
  max-height: 34vh;
  object-fit: cover;
}

#building-screen {
  max-width: 800px;
  margin: auto;

  & > * {
    margin: 50px 0;
  }
}
</style>
