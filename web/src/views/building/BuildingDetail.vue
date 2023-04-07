<template>
  <div class="building-info">
    <BuildingData :id="id" />
    <VueDatePicker
      class="date"
      v-model="selectedDate"
      :enable-time-picker="false"
      input-class-name="v-field__input"
      :format="formatDate"
      @update:model-value="change"
    />
    <div v-if="get() === null" class="centre text-center">
      <v-icon icon="mdi-alert-circle" size="x-large" />
      <h2>Geen gegevens voor dit gebouw op {{ formatDate(selectedDate) }}.</h2>
      <p>Selecteer een ander gebouw of kies een andere datum.</p>
    </div>
    <div v-else>
      <div class="centre px-4 mb-4">
        <h2>Bezoek ({{ formatDate(selectedDate) }})</h2>
        <button
          @click="
            router.push({
              name: 'account_id',
              params: { id: 2, isadmin: 'false' },
            })
          "
        >
          <Avatar :name="get().student" size="40" />
          {{ get().student }}
        </button>
        <div class="image-grid" style="margin-top: 10px">
          <div
            v-for="image in images"
            :key="String(image.url)"
            style="position: relative"
          >
            <ImageCard
              :img="String(image.url)"
              btn-icon="mdi-email-arrow-right"
              btn-text="Send report"
            />
          </div>
        </div>
        <h3 v-if="get().comments">Opmerkingen</h3>
        <div class="image-grid" style="margin-top: 10px">
          <div
            v-for="comment in get().comments"
            :key="comment.title"
            style="position: relative"
          >
            <ImageCard
              :title="comment.title"
              :text="comment.comment"
              btn-icon="mdi-email-arrow-right"
              btn-text="Send report"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BuildingData from "@/components/building/BuildingData.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import Avatar from "@/components/Avatar.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { createDate, formatDate } from "@/assets/scripts/date";
import { ref } from "vue";
import router from "@/router";

const props = defineProps({
  id: String,
  date: String,
});

const selectedDate = ref<Date>(createDate(String(props.date)));

function get(): any {
  if (formatDate(selectedDate.value) === mockbuilding.date) {
    return mockbuilding;
  }
  return null;
}

function change() {
  router.push({
    name: "building_id_detail",
    params: { id: props.id, date: formatDate(selectedDate.value) },
  });
}

const mockbuilding = {
  id: "0",
  name: "Eiffeltoren",
  date: "15/3/2023",
  student: "Mats Van Belle",
  comments: [
    {
      title: "Kapotte deur",
      comment: "De deur in de berging is kapot",
    },
  ],
};

function log() {
  console.log("JA");
}

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
.centre {
  max-width: 800px;
  margin: auto;
}

.date {
  width: 20%;
  min-width: 140px;
  position: absolute;
  top: 80px;
  right: 20px;
}

.text-center {
  text-align: center;
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
