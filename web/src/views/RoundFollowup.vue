<template>
  <!-- Card that lets you select the round -->
  <v-card title="Kies ronde" prepend-icon="mdi-transit-detour" class="ma-3">
    <template v-slot:append>
      <v-card-actions>
        <router-link to="/rondes/plannen">
          <v-btn color="primary"> Ronde plannen </v-btn>
        </router-link>
        <router-link to="/dashboard/rondes/nieuw">
          <v-btn color="primary"> Ronde aanmaken </v-btn>
        </router-link>
      </v-card-actions>
    </template>

    <v-row class="py-0 my-0 mx-1">
      <v-col>
        <v-select
          label="selecteer week"
          :items="['Week1', 'Week2', 'Week3']"
          variant="solo"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="selecteer ronde"
          :items="['Ronde 1', 'Ronde 2']"
          variant="solo"
        ></v-select>
      </v-col>
    </v-row>
  </v-card>

  <!-- Simple vlist that uses the custom component RoundCard -->
  <v-list class="mx-3">
    <v-card-title>Rondes van vandaag</v-card-title>
    <RoundCard
      v-for="(round, i) in mockrounds"
      :key="i"
      :round_name="round.name"
      :round_start="round.start"
      :round_end="round.end"
      :round_started="round.started"
      :student_name="round.student"
      :building_index="round.current_building"
      :total_buildings="round.buildings.length"
      :round_comments="round.comments"
      @click="redirect_to_detail()"
      style="cursor: pointer"
    ></RoundCard>
    <v-spacer></v-spacer>
  </v-list>
</template>

<script lang="ts" setup>
import Round from "@/components/models/Round";
import RoundCard from "@/components/RoundCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function redirect_to_detail() {
  router.push({ path: "/rondes/detail" });
}

// TODO: mockdata for rounds, remove in future
const mockrounds: Round[] = [
  {
    name: "Grote Markt",
    start: "13:30",
    end: "14:00",
    started: true,
    student: "Emma",
    comments: true,
    current_building: 5,
    buildings: [
      {
        name: "Smith",
        address: "Gent, Belgium",
        deltatime: "10 min",
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Johnson",
        address: "Brussels, Belgium",
        deltatime: "35 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Smith",
        address: "Gent, Belgium",
        deltatime: "10 min",
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Johnson",
        address: "Brussels, Belgium",
        deltatime: "35 min",
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Brown",
        address: "Antwerp, Belgium",
        deltatime: "25 min",
        comments: true,
        amount_of_pics: 4,
      },
    ],
  },
  {
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
  },
  {
    name: "Korenmarkt",
    start: "16:15",
    end: "",
    student: "Alex",
    started: false,
    comments: false,
    current_building: 0,
    buildings: [
      {
        name: "Wilson",
        address: "Veldstraat, Belgium",
        deltatime: "5 min",
        comments: false,
        amount_of_pics: 3,
      },
      {
        name: "Moore",
        address: "Liege, Belgium",
        deltatime: "45 min",
        comments: false,
        amount_of_pics: 5,
      },
      {
        name: "Anderson",
        address: "Mons, Belgium",
        deltatime: "30 min",
        comments: false,
        amount_of_pics: 2,
      },
    ],
  },
];
</script>
