<template>
  <div class="selector px-4">
    <v-select
      class="building-select"
      label="Gebouw"
      :items="buildings"
      v-model="selectedBuilding"
    />
    <VueDatePicker
      class="date-select"
      v-model="selectedDate"
      :enable-time-picker="false"
      input-class-name="v-field__input"
      :format="formatDate"
    ></VueDatePicker>
  </div>
  <div class="building-info" v-if="selectedDate && selectedBuilding">
    <div
      v-if="get(selectedBuilding, formatDate(selectedDate)) === null"
      class="centre text-center"
    >
      <v-icon icon="mdi-alert-circle" size="x-large" />
      <h2>Geen data voor dit gebouw op {{ formatDate(selectedDate) }}.</h2>
      <p>Selecteer een ander gebouw of kies een andere datum.</p>
    </div>
    <div v-else>
      <BuildingData id="1" />
      <div class="centre px-4 mb-4">
        <h2>Bezoek ({{ formatDate(selectedDate) }})</h2>
        <button
          @click="
            router.push({
              name: 'account_settings',
              params: { id: 2, isadmin: 'false' },
            })
          "
        >
          <Avatar
            :name="get(selectedBuilding, formatDate(selectedDate)).student"
            size="40"
          />
          {{ get(selectedBuilding, formatDate(selectedDate)).student }}
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
        <h3 v-if="get(selectedBuilding, formatDate(selectedDate)).comments">
          Opmerkingen
        </h3>
        <div class="image-grid" style="margin-top: 10px">
          <div
            v-for="comment in get(selectedBuilding, formatDate(selectedDate))
              .comments"
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
import BuildingData from "@/components/BuildingData.vue";
import ImageCard from "@/components/ImageCard.vue";
import Avatar from "@/components/Avatar.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { formatDate } from "@/assets/scripts/format";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// reactive component which will store the current user
const selectedBuilding = ref<String>("");
const selectedDate = ref<Date>(new Date());

function get(buildingName: String, buildingDate: String) {
  for (let building of mockbuildingdata) {
    if (building.name === buildingName && building.date === buildingDate) {
      return building;
    }
  }
  return null;
}

// TODO: mockdata, remove in future
const buildings: string[] = [
  "Eiffeltoren",
  "Taj Mahal",
  "Machu Picchu",
  "Piramide",
  "Atomium",
  "Toren van Pisa",
];

const mockbuildingdata: any[] = [
  {
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
  },
  {
    id: "1",
    name: "Piramide",
    date: "15/3/2023",
    student: "Brent Matthys",
  },
  {
    id: "2",
    name: "Atomium",
    date: "13/3/2023",
    student: "Jens Pots",
    comments: [
      {
        title: "Lelijk",
        comment: "...",
      },
    ],
  },
];

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
.v-container {
  padding-top: 0;
}

.selector {
  width: 100%;
  display: flex;
}

.building-select {
  width: 40%;
}

.date-select {
  width: 20%;
  min-width: 140px;
}

.centre {
  max-width: 800px;
  margin: auto;
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
