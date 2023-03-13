<template>
  <div class="building-screen">
    <div class="heading-image">
      <v-img cover src="https://source.unsplash.com/featured/1920x1080"></v-img>
    </div>
    <v-sheet rounded class="building-info">
      <h1 class="building-name">Gebouw {{ id }}</h1>
      <p class="building-description">
        <i
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.</i
        >
      </p>
      <div class="building-actions">
        <v-btn class="building-action-button" prepend-icon="mdi-map-search"
          >google maps</v-btn
        >
        <v-btn class="building-action-button" prepend-icon="mdi-file-pdf-box"
          >handleiding</v-btn
        >
      </div>
      <building-schedule :id="id" />
      <v-card class="building-comments" title="Opmerkingen">
        <v-list>
          <v-list-item
            class="building-comment"
            title="Poort Nummer"
            subtitle="1234"
          ></v-list-item>
          <v-list-item
            class="building-comment"
            title="Noodtelefoon"
            subtitle="+320 00 00 00 00"
          ></v-list-item>
        </v-list>
      </v-card>
      <building-photos :id="id" />
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import BuildingSchedule from "@/components/BuildingSchedule";
import BuildingPhotos from "@/components/buildingPhotos";

// get the route object, needed to show the title
const route = useRoute();

// reactive state to show the drawer or not
const id = ref(route.params.id);
</script>

<style scoped lang="scss">
@import "src/assets/styles/base";

// wrapper for the whole screen, used for basic properties that apply to the whole page.
.building-screen {
  height: 100%;
  width: 100%;
  background-color: $primary;
}

// the image of the building displayed in the top bar.
.heading-image {
  height: 25vh;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

// the container for all the building text, should be in the center of the screen.
.building-info {
  margin: calc(25vh - 89px) auto auto;
}

// the buttons under the description.
.building-action-button {
  margin: 10px 10px 10px 0;
  width: calc(50% - 10px);
}

.v-card {
  margin: 10px 10px 10px 0;
}
</style>
