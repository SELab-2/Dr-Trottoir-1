<template>
  <LargeFilter
    :search_by_labels="query_labels"
    :sort_items="sort_items"
    :filter_items="filter_options"
    class="ma-3"
    @onSearch="(q: string) => query = q"
    @searchLabel="(l: string) => label = l"
    @filters="(f: string[]) => filters = f"
    @sortBy="(s: string) => sort = s"
    @startDate="(sd: Date) => start_date = sd"
    @endDate="(ed: Date) => end_date = ed"
    @sortAscending="(a: boolean) => sort_ascending = a"
  />

  <!-- Simple vlist that uses the custom component RoundCard -->
  <v-list class="mx-2">
    <RoundCard
      v-for="(round, i) in filtered_data()"
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
import { ref } from "vue";

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

// filter props to pass to largefilter component
const query_labels = ['Ronde', 'Persoon'];
const filter_options = ['Klaar', 'Bezig', 'Niet begonnen', 'Opmerkingen'];
const sort_items= ['Voortgang', 'Gebouwen'];


// All the filter options
const query = ref<string>('');
const label = ref<string>(query_labels[0]);
const filters = ref<string[]>([]);
const sort = ref<string>(sort_items[0]);
const start_date = ref<Date>(new Date());
const end_date = ref<Date>(new Date());
const sort_ascending = ref<boolean>(true);

function filter_query(round: Round): boolean {
  let search_by: string = "";
  switch(label.value){
    case query_labels[0]:
      search_by = round.name.toLowerCase();
      break;
    case query_labels[1]:
      search_by = round.student.toLowerCase();
      break;
  }
  return search_by.includes(query.value.toLowerCase()) ||
      query.value.length == 0
}

function filter_date(): boolean {
  // TODO: fix when rounds actually have dates
  return true;
}

function filter_filters(round: Round): boolean {
  if(filters.value.length == 0){
    return true;
  }
  let result: boolean = false;
  for(const option of filters.value){
    switch(option){
      case 'Klaar':
        result = round.current_building == round.buildings.length;
        break;
      case 'Bezig':
        result = 0 < round.current_building && 
          round.current_building < round.buildings.length;
        break;
      case 'Niet begonnen':
        result = round.current_building == 0;
        break;
      case 'Opmerkingen':
        result = round.comments;
        break;
    }
    if(result){
      return result;
    }
  }
  return result;
}

function progress(done: number, total: number): number{
  return Math.round((done / total) * 100);
}

// The list of data after filtering
function filtered_data() : Round[]  {
  const result: Round[] = [];
  // filtering
  mockrounds.forEach(elem =>{
    let can_add = true;

    // filter on query input
    can_add = can_add && filter_query(elem);
    // apply filter options
    can_add = can_add && filter_filters(elem);

    if(can_add){
      result.push(elem);
    }
  });

  // sort the results
  result.sort((a,b) => {
    if(sort.value == 'Gebouwen'){
      return (a.buildings.length > b.buildings.length ? 1 : -1);
    }else{
      const ap = progress(a.current_building, a.buildings.length);
      const bp = progress(b.current_building, b.buildings.length);
      return (ap > bp ? 1 : -1);
    }
  }
  )
  // set sorting order
  if(!sort_ascending.value){
    result.reverse()
  }
  return result;
}
</script>
