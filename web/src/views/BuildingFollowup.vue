<template>
  <v-container fluid>
    <div class="selector">
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
        :format="format"
      ></VueDatePicker>
    </div>
    <div class="building-info" v-if="selectedDate && selectedBuilding">
      <h1>{{ selectedBuilding }} op {{ format(selectedDate) }}</h1>
      <h2 v-if="get(selectedBuilding, format(selectedDate)) === null">
        geen data
      </h2>
      <BuildingData v-else :building='get(selectedBuilding, format(selectedDate))' />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { ref } from "vue";
import BuildingData from '@/components/BuildingData.vue'

// reactive component which will store the current user
const selectedBuilding = ref<String>("");
const selectedDate = ref<Date>(new Date());

const format = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

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
    date: "13/3/2023",
    comments: [
      {
        title: "ambetant gebouw",
        comment: "geen leuk gebouw",
      },
      {
        title: "lange code",
        comment: "12 karakters is te lang",
      },
      {
        title: "ver",
        comment: "zeer ver van de andere gebouwen in de route",
      },
    ],
  },
  {
    id: "1",
    name: "Atomium",
    date: "13/3/2023",
    comments: [
      {
        title: "Lelijk",
        comment: "...",
      },
    ],
  },
];
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
  margin-left: 10%;
  width: 20%;
}
</style>
