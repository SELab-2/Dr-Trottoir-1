<template>
  <v-card>
    <v-card-title>
      {{ mockround.name }}
    </v-card-title>
    <v-card-subtitle>
      <v-icon icon="mdi-account">
      </v-icon>{{ mockround.student }}
    </v-card-subtitle>
  <v-timeline side="end">
    <v-timeline-item dot-color="green" icon="mdi-check">
    <v-card>
        <v-card-title>
          Start {{ mockround.start }}
        </v-card-title>
      </v-card>
    </v-timeline-item>
    <v-timeline-item
      v-for="(building, id) in mockround.buildings"
      :key="id"
      :dot-color="mockdata[id].color"
      :size="mockdata[id].color != 'red'? 'default' : 'small'"
      :icon="mockdata[id].icon"
    >
    <v-card>
      <div class="d-flex mb-6 align-center">
        <v-card-title class="ma-2 pa-2 me-auto">
          {{ building.name }}
        </v-card-title>
        <v-card-title class="ma-2 pa-2">
          {{ cleanup_time_data(id) }}
        </v-card-title>
      </div>
        
        <v-card-text class="bg-white text--primary">
          <p>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.</p>
          <v-btn
            color="blue"
            variant="outlined"
          >
            Button
          </v-btn>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline></v-card>
</template>

<script lang="ts" setup>
import Round from "@/components/models/Round";

//TODO remove after mockpresentation
const mockdata = [{time_start : '16:10', time_end: '16:12', color : 'green', icon : 'mdi-check'}, 
                  {time_start : '16:15', time_end: '', color : 'orange', icon : 'mdi-account-clock-outline'},
                  {time_start : '', time_end: '', color : 'red', icon : 'mdi-office-building'},
                  {time_start : '', time_end: '', color : 'red', icon : 'mdi-office-building'},
                  {time_start : '', time_end: '', color : 'red', icon : 'mdi-office-building'}, 
                  {time_start : '', time_end: '', color : 'red', icon : 'mdi-office-building'},
                  {time_start : '', time_end: '', color : 'red', icon : 'mdi-office-building'},
                  {time_start : '', time_end: '', color : 'red', icon : 'mdi-office-building'}]

function cleanup_time_data(id : number){
  const building = mockdata[id]
  if (building.time_end) {
    return `${building.time_start} - ${building.time_end}`
  } else {
    return `${building.time_start}`
  }

}


const mockround: Round = {
  name: "Vrijdagmarkt",
  start: "16:00",
  end: "",
  started: true,
  student: "Sophie",
  comments: false,
  current_building: 1,
  buildings: [
    {
      name: "Garcia",
      address: "Bruges, Belgium",
      deltatime: "15 min",
      comments: false,
      amount_of_pics: 3,
    },
    {
      name: "Miller",
      address: "Leuven, Belgium",
      deltatime: "20 min",
      comments: false,
      amount_of_pics: 2,
    },
    {
      name: "Clark",
      address: "Ostend, Belgium",
      deltatime: "30 min",
      comments: false,
      amount_of_pics: 4,
    },
    {
      name: "Miller",
      address: "Leuven, Belgium",
      deltatime: "20 min",
      comments: false,
      amount_of_pics: 2,
    },
    {
      name: "Clark",
      address: "Ostend, Belgium",
      deltatime: "30 min",
      comments: false,
      amount_of_pics: 4,
    },
    {
      name: "Miller",
      address: "Leuven, Belgium",
      deltatime: "20 min",
      comments: false,
      amount_of_pics: 2,
    },
    {
      name: "Clark",
      address: "Ostend, Belgium",
      deltatime: "30 min",
      comments: false,
      amount_of_pics: 4,
    },
  ],
};
</script>
