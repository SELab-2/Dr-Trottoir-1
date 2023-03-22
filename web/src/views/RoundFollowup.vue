<template>
  <LargeFilter
    :search_by_labels="['Ronde', 'Persoon']"
    :sort_items="['Tijd', 'Gebouwen', 'Voortgang']"
    :filter_items="['Klaar', 'Bezig', 'Niet begonnen']"
    class="ma-3"
    @onSearch="(query: string) => on_query_update(query)"
    @searchLabel="(label: string) => on_search_label_update(label)"
    @filter="(filters: string[]) => on_filters_update(filters)"
    @sortBy="(sort: string) => on_sort_update(sort)"
    @startDate="(date: Date) => on_start_date_update(date)"
    @endDate="(date: Date) => on_end_date_update(date)"
  />

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
import LargeFilter from "@/components/LargeFilter.vue";
import { useRouter } from "vue-router";
import { sort } from "semver";

///////////////////////////////////////////////
/// Section that handles all filter options ///
///////////////////////////////////////////////

function on_query_update(query: string){
  console.log(query);
}

function on_search_label_update(label: string){
  console.log(label);
}

function on_filters_update(filters: string[]){
  console.log(filters);
}

function on_sort_update(sort: string){
  console.log(sort);
}

function on_start_date_update(date: Date){
  console.log("startdate: "+date);
}

function on_end_date_update(date: Date){
  console.log("enddate: "+date);
}

//////////////////////////////////
/// End filter options section ///
//////////////////////////////////


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
