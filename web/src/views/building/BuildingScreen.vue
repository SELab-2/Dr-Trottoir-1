<template>
  <BuildingData :id="id" />
  <div id="building-screen" class="px-4">
    <GarbageSchedule />

    <div>
      <h2>Huidig bezoek</h2>
      <div class="image-grid" style="margin-top: 10px">
        <div
          v-for="image in images"
          :key="String(image.url)"
          style="position: relative"
        >
          <ImageCard
            :img="String(image.url)"
            btn-icon="mdi-pencil"
            btn-text="Bewerken"
          />
        </div>
        <ImageCard title="TOEVOEGEN" title-icon="mdi-plus" />
      </div>
      <h3>Opmerkingen</h3>
      <div class="image-grid" style="margin-top: 10px">
        <div
          v-for="comment in comments"
          :key="comment.title"
          style="position: relative"
        >
          <ImageCard
            :title="comment.title"
            :text="comment.comment"
            btn-icon="mdi-pencil"
            btn-text="Bewerken"
          />
        </div>
        <ImageCard title="TOEVOEGEN" title-icon="mdi-plus" />
      </div>
    </div>
  </div>
  <AddButton icon="mdi-plus" :items="actions" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import BuildingData from "@/components/building/BuildingData.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import GarbageSchedule from "@/components/building/GarbageSchedule.vue";

defineProps({
  id: String,
});

const images = ref<Array<{ about: string | null; time: Date; url: string }>>([
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

const comments = ref<Array<{ title: string; comment: string }>>([
  {
    title: "Kapotte deur",
    comment: "De deur in de berging is kapot",
  },
]);

// TODO: this should become an actual redirect to page
function foto() {
  console.log("foto");
}

function opmerking() {
  console.log("opmerking");
}

const actions = [
  {
    title: "Foto toevoegen",
    clicked: foto(),
  },
  {
    title: "Opmerking toevoegen",
    clicked: opmerking(),
  },
];
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

.schedule-action {
  display: flex;
  padding: 20px;
}

.schedule-date {
  height: 90px;
  padding-top: 0;
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
</style>
