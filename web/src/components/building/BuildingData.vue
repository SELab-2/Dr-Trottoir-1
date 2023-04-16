<template>
  <img
    alt="banner"
    id="banner"
    src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
  />
  <HFillWrapper>
    <div class="general-info-main">
      <div class="d-flex justify-space-between">
        <h1 class="building-name">El Paradisio</h1>
        <RoundedButton
          v-if="isSyndicus"
          @clicked="toEdit"
          icon="mdi-pencil"
          class="mt-2"
        />
      </div>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap">
        <RoundedButton icon="mdi-map-search" value="Kaarten" />
        <RoundedButton icon="mdi-file-pdf-box" value="Handleiding" />
        <RoundedButton icon="mdi-lock" value="3142" />
      </div>

      <div class="mt-5" style="display: flex; gap: 6px; align-items: center; border-radius: 10px; background-color: white; padding: 10px;">
        <Avatar name="Jens Pots"></Avatar>

        <div>
          <p style="font-weight: 500; font-size: 12px">SYNDICUS</p>
          <p style="font-weight: 700">Jens Pots</p>
        </div>

        <div style="flex-grow: 1"></div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <RoundedButton icon="mdi-phone" value="0471234567" />
          <RoundedButton icon="mdi-mail" value="E-mail" />
        </div>
      </div>
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import router from "@/router";
import Avatar from "@/components/Avatar.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

const isSyndicus = true;

function toEdit() {
  router.push({ name: "building_new" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
defineProps({
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
