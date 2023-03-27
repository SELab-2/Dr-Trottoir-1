<template>
  <v-card :title="mockround.name" :subtitle="date" variant="flat" class="ma-1">
    <!-- Select component to select the role, will be removed after auth -->
    <template v-slot:append>
      <v-select variant="solo"
        v-model="current_role"
        :items="roles"
      />
    </template>
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-btn
            v-bind="props"
            class="text-body-2 mb-2 ml-3"
            :variant="isHovering ? 'elevated': 'text'"
            to="/account/0/false"
          >
            <template v-slot:prepend>
              <Avatar :name="mockround.student" size="x-small"/>
            </template>
            {{ mockround.student }}    
          </v-btn>
        </template>
      </v-hover>
      <v-timeline truncate-line="both" side="end" density="compact" class="mx-3">
        <v-timeline-item dot-color="green" icon="mdi-check">
          <v-card>
            <v-card-title> Start {{ mockround.start }} </v-card-title>
          </v-card>
        </v-timeline-item>
        <v-timeline-item
          width="100%"
          v-for="(building, id) in mockround.buildings"
          :key="id"
          :dot-color="mockdata[id].color"
          :size="mockdata[id].color != 'red' ? 'default' : 'small'"
          :icon="mockdata[id].icon"
          icon-color="white"
        >
          <router-link to="/gebouw/3">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-card
                  v-bind:="props"
                  width="100%"
                  :title="building.name"
                  :subtitle="building.address"
                  :color="isHovering ? 'grey-lighten-5': ''"
                >
                  <template v-slot:append>
                    <v-card-title>{{ cleanup_time_data(id) }}</v-card-title>
                  </template>
                  <v-chip
                    prepend-icon="mdi-camera"
                    label
                    color="success"
                    class="pa-2 ma-2"
                    v-if="id < 2"
                  >
                    {{ building.amount_of_pics }} foto's geupload
                  </v-chip>
                  <v-chip
                    prepend-icon="mdi-comment"
                    label
                    color="red"
                    class="pa-2 ma-2"
                    v-if="building.comments"
                  >
                    Opmerkingen beschikbaar
                  </v-chip>
                </v-card>

              </template>
            </v-hover>
            
          </router-link>
        </v-timeline-item>
        <v-timeline-item dot-color="red" icon="mdi-close" size="small">
          <v-card>
            <v-card-title> Einde {{ mockround.start }} </v-card-title>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    <v-card-actions class="d-flex">
      <v-spacer></v-spacer>
      <v-btn
        to="/dashboard/rondes/rapport"
        prepend-icon="mdi-check"
        color="primary"
        >Ronde stoppen</v-btn
      >
    </v-card-actions>
  </v-card>

</template>

<script lang="ts" setup>
import Round from "@/components/models/Round";
import Avatar from "@/components/Avatar.vue";
import { ref } from 'vue'

// add the role, will be replaced with actual athentication
// TODO: replace with actual authentication
const roles = ['Admin', 'Student', 'Superstudent', 'Syndicus']
const current_role = ref(roles[0])


const date = "13/03/2023";

//TODO remove after mockpresentation
const mockdata = [
  { time_start: "16:10", time_end: "16:12", color: "green", icon: "mdi-check" },
  {
    time_start: "16:15",
    time_end: "",
    color: "orange",
    icon: "mdi-account-clock",
  },
  { time_start: "", time_end: "", color: "red", icon: "mdi-office-building" },
  { time_start: "", time_end: "", color: "red", icon: "mdi-office-building" },
  { time_start: "", time_end: "", color: "red", icon: "mdi-office-building" },
  { time_start: "", time_end: "", color: "red", icon: "mdi-office-building" },
  { time_start: "", time_end: "", color: "red", icon: "mdi-office-building" },
  { time_start: "", time_end: "", color: "red", icon: "mdi-office-building" },
];

function cleanup_time_data(id: number) {
  const building = mockdata[id];
  if (building.time_end) {
    return `${building.time_start} - ${building.time_end}`;
  } else {
    return `${building.time_start}`;
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
      comments: true,
      amount_of_pics: 5,
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
