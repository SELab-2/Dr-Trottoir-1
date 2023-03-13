<template>
  <v-container fluid>
    <div class='selector'>
      <v-select
        class='building-select'
        label="Gebouw"
        :items="buildings"
        v-model="selectedBuilding"
      />
      <VueDatePicker class='date-select' v-model="selectedDate" :enable-time-picker="false" input-class-name="v-field__input" :format="format"></VueDatePicker>
    </div>
    <div class='building-info' v-if='selectedDate && selectedBuilding'>
      <h1>{{selectedBuilding}} op {{format(selectedDate)}}</h1>
      <h2 v-if='get(selectedBuilding, format(selectedDate)) === null'>geen data</h2>
      <div v-else>
        <div class="photos" title="Foto's">
          <v-card class='photo' cover>
            <v-img class='photo-image' cover src="https://source.unsplash.com/featured/340x340"/>
            <div>
              <v-card-title>Foto aankomst</v-card-title>
              <v-card-subtitle>18u30</v-card-subtitle>
            </div>
          </v-card>
          <v-card class='photo' cover>
            <v-img class='photo-image' cover src="https://source.unsplash.com/featured/350x350"/>
            <div>
              <v-card-title>Foto afval</v-card-title>
              <v-card-subtitle>18u40</v-card-subtitle>
            </div>
          </v-card>
          <v-card class='photo' cover>
            <v-img class='photo-image' cover src="https://source.unsplash.com/featured/360x360"/>
            <div>
              <v-card-title>Foto vertrek</v-card-title>
              <v-card-subtitle>18u45</v-card-subtitle>
            </div>
          </v-card>
        </div>
        <v-card class="comments" title="Opmerkingen">
          <v-list>
            <v-list-item
              v-for='comment of get(selectedBuilding, format(selectedDate)).comments'
              :key='comment.title'
              class="comment"
              :title="comment.title"
              :subtitle="comment.comment"
            ></v-list-item>
          </v-list>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from "vue";

// reactive component which will store the current user
const selectedBuilding = ref<String>("");
const selectedDate = ref<Date>(ref(new Date()));

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function get(buildingName, buildingDate) {
  for (let building of this.mockbuildingdata) {
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
  "Toren van Pisa"
];

const mockbuildingdata: any[] = [
  {
    id: "0",
    name: "Eiffeltoren",
    date: "13/3/2023",
    comments: [
      {
        title: "ambetant gebouw",
        comment: "geen leuk gebouw"
      },
      {
        title: "lange code",
        comment: "12 karakters is te lang"
      },
      {
        title: "ver",
        comment: "zeer ver van de andere gebouwen in de route"
      }
    ]
  },
  {
    id: "1",
    name: "Atomium",
    date: "13/3/2023",
    comments: [
      {
        title: "Lelijk",
        comment: "..."
      }
    ]
  },
]

</script>

<style scoped lang='scss'>
  .v-container{
    padding-top: 0;
  }

  .selector{
    width: 100%;
    display: flex;
  }

  .building-select{
    width: 40%;
  }

  .date-select {
    margin-left: 10%;
    width: 20%;
  }

  .v-card {
    margin: 10px 10px 10px 0;
  }

  .photo{
    display: flex;
  }

  .photo-image{
    height: inherit;
    width: inherit;
    max-height: 200px;
    max-width: 200px;
  }

</style>
