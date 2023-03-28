<template>
  <v-card :title="bussyround.name" :subtitle="date" variant="flat" class="ma-1">
    <!-- Select component to select the role, will be removed after auth -->
    <template v-slot:append>
      <v-select variant="solo"
        v-model="current_role"
        :items="roles"
      />
    </template>
      <!-- The name and avatar of the student -->
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-btn
            v-bind="props"
            class="text-body-2 mb-2 ml-3"
            :variant="isHovering ? 'elevated': 'text'"
            to="/account/0/false"
          >
            <template v-slot:prepend>
              <Avatar :name="bussyround.student" size="x-small"/>
            </template>
            {{ bussyround.student }}    
          </v-btn>
        </template>
      </v-hover>

      <!-- The main timeline, containing all te stops -->
      <v-timeline truncate-line="both" side="end" density="compact" class="mx-3">

        <v-timeline-item dot-color="green" icon="mdi-check">
          <!-- We started: same view for everyone -->
          <v-card v-if="bussyround.started">
            <v-card-title> Start {{ bussyround.start }} </v-card-title>
          </v-card>
          <!-- Student has other option when not started -->
          <v-btn 
            v-else-if="current_role === 'Student'"
            color="success"
            @click="start_popup = !start_popup"
          >
            Start ronde

            <!-- Show warning before start -->
            <v-overlay v-model="start_popup">
              <v-snackbar v-model="start_popup" timeout="-1" elevation="24" color="white">
                <StartRoundPopup
                  to="/rondes/detail"
                  @cancel="val => start_popup = val"
                />
              </v-snackbar>
            </v-overlay>
          </v-btn>
        </v-timeline-item>

        <v-timeline-item
          width="100%"
          v-for="(building, id) in bussyround.buildings"
          :key="id"
          :dot-color="mockdata[id].color"
          :size="mockdata[id].color != 'red' ? 'large' : 'small'"
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
            <v-card-title> Einde {{ bussyround.start }} </v-card-title>
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
import StartRoundPopup from "@/components/StartRoundPopupContent.vue";
import { ref } from 'vue'

// add the role, will be replaced with actual athentication
// TODO: replace with actual authentication
const roles = ['Admin', 'Student', 'Superstudent', 'Syndicus'];
const current_role = ref(roles[0]);

// state to keep track of the startround popup
const start_popup = ref(false);

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



const bussyround: Round = {
  name: "Vrijdagmarkt",
  start: "16:00",
  end: "",
  started: false,
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

const doneround: Round = {
  name: "Vrijdagmarkt",
  start: "16:00",
  end: "",
  started: true,
  student: "Sophie",
  comments: false,
  current_building: 1,
  buildings: [
  {
    name: "Upkot",
    address: "Witbakkerstraat 49",
    deltatime: "15 min",
    comments: true,
    amount_of_pics: 3,
  },
  {
    name: "Delhaize",
    address: "boulevard Antoine 221",
    deltatime: "50 min",
    comments: false,
    amount_of_pics: 7,
  },
  {
    name: "Q8",
    address: "Pastoor Goossenslaan 34",
    deltatime: "30 min",
    comments: false,
    amount_of_pics: 3,
  },
  {
    name: "Appartment 4",
    address: "Oranjeboomstraat 345",
    deltatime: "20 min",
    comments: true,
    amount_of_pics: 3,
  },
  ],
};
</script>
