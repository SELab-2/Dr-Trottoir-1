<template>
  <img
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
        <RoundedButton icon="mdi-map-search" value="Kaarten"></RoundedButton>
        <RoundedButton
          icon="mdi-file-pdf-box"
          value="Handleiding"
        ></RoundedButton>
        <RoundedButton icon="mdi-phone" value="0471234567"></RoundedButton>
        <RoundedButton icon="mdi-mail" value="E-mail"></RoundedButton>
        <RoundedButton icon="mdi-lock" value="3142"></RoundedButton>
      </div>
    </div>

    <div class="schedule" v-bind:key="item" v-for="item in schedule">
      <h2>{{ item }}</h2>

      <div class="schedule-grid">
        <div class="schedule-action">
          <div>
            <p style="font-weight: 500; font-size: 22px">GFT</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </p>
          </div>
          <p>07u30</p>
        </div>
        <div class="schedule-action">
          <div>
            <p style="font-weight: 500; font-size: 22px">REST</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </p>
          </div>
          <p>10u00</p>
        </div>
        <div class="schedule-action">
          <div>
            <p style="font-weight: 500; font-size: 22px">Grof huisvuil</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </p>
          </div>
          <p>14u15</p>
        </div>
        <div
          class="schedule-action"
          style="justify-content: center; align-items: center"
        >
          <v-icon color="#333333" icon="mdi-plus"></v-icon>
          <p style="font-weight: bolder">TOEVOEGEN</p>
        </div>
      </div>
    </div>

    <div>
      <h2>Huidig bezoek</h2>
      <div class="image-grid" style="margin-top: 10px">
        <div
          v-for="image in images"
          :key="String(image.url)"
          style="position: relative"
        >
          <img alt="opvolgfoto" class="image" :src="String(image.url)" />
          <div style="position: absolute; bottom: 20px; right: 10px">
            <RoundedButton icon="mdi-pencil" value="Bewerken"></RoundedButton>
          </div>
        </div>
        <div
          class="schedule-action"
          style="justify-content: center; align-items: center"
        >
          <v-icon color="#333333" icon="mdi-plus"></v-icon>
          <p style="font-weight: bolder">TOEVOEGEN</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import RoundedButton from "@/components/RoundedButton.vue";

// reactive state to show the drawer or not
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  id: String,
});

const schedule = ref<string[]>(["Vandaag", "Morgen"]);

const images = ref<Array<{ about: String | null; time: Date; url: String }>>([
  {
    time: new Date(),
    about: "Aankomst",
    url: "https://unsplash.com/photos/gMnA1dUkmkM/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8NXx8YmFzZW1lbnR8ZW58MHx8fHwxNjc4NzgxMTgw&force=true&w=640",
  },
  {
    time: new Date(),
    about: null,
    url: "https://unsplash.com/photos/Tb4bUf6z9gI/download?force=true&w=640",
  },
  {
    time: new Date(),
    about: null,
    url: "https://unsplash.com/photos/u_khkgVDmxA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFzZW1lbnR8ZW58MHx8fHwxNjc4NzgxMTgw&force=true&w=640",
  },
  {
    time: new Date(),
    about: null,
    url: "https://unsplash.com/photos/Tac8FvqAnEw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mjh8fGJhc2VtZW50fGVufDB8fHx8MTY3ODgwMTI1OQ&force=true&w=640",
  },
  {
    time: new Date(),
    about: "Vertrek",
    url: "https://unsplash.com/photos/sSRGytOhIkQ/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjc4ODMyNDEy&force=true&w=640",
  },
]);
</script>

<style scoped lang="scss">
@import "src/assets/styles/base";

ul {
  list-style-type: none;
  list-style-position: inside;
}

#building-screen {
  max-width: 800px;
  margin: auto;

  & > * {
    margin: 50px 0;
  }
}

#banner {
  width: 100%;
  max-height: 34vh;
  object-fit: cover;
}

.general-info-main {
  & > * {
    margin: 10px 0;
  }
}

.schedule-grid {
  display: grid;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.schedule {
  & > * {
    margin: 10px 0;
  }
}

.schedule-action {
  display: flex;
  padding: 20px;
  justify-content: space-between;
  border-radius: 5px;
  border: 2px solid #f1f1f1;
  background: #fafafa;
}

.image-card {
  border-radius: 5px;
  background: #f1f1f1;
}

.image-grid {
  display: grid;
  gap: 10px;

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 500px) and (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.image {
  width: 100%;
  height: fit-content;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 5px;
}

.image-about {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
