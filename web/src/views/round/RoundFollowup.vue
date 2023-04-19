<template>
  <HFillWrapper>
    <LargeFilter
      :search_by_labels="query_labels"
      :sort_items="sort_items"
      :filter_items="filter_options"
      class="mx-1 mb-3"
      @onUpdate="(new_data: FilterData) => filter_data = new_data"
    />
    <RoundCard
      v-for="(round, i) in filtered_data()"
      :key="i"
      :round_name="round.name"
      :round_start="
        round.start_time ? round.start_time.toLocaleTimeString('nl') : ''
      "
      :round_end="round.end_time ? round.end_time.toLocaleTimeString('nl') : ''"
      :round_started="round.start_time ? true : false"
      :student_name="round.student"
      :building_index="completed_buildings(round)"
      :total_buildings="round.buildings.length"
      :round_comments="round_has_comments(round)"
      @click="redirect_to_detail()"
      style="cursor: pointer"
    ></RoundCard>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import Round from "@/components/models/Round";
import RoundCard from "@/components/cards/RoundCard.vue";
import LargeFilter from "@/components/filter/LargeFilter.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import FilterData from "@/components/filter/FilterData";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

// the router constant
const router = useRouter();

function redirect_to_detail() {
  router.push({ name: "round_detail", params: { id: 0 } });
}

function round_has_comments(round: Round): boolean {
  for (const building of round.buildings) {
    if (building.comments) {
      return true;
    }
  }
  return false;
}

function completed_buildings(round: Round): number {
  let count = 0;
  for (const building of round.buildings) {
    if (building.end_time) {
      count++;
    }
  }
  return count;
}

// TODO: mockdata for rounds, remove in future
const mockrounds: Round[] = [
  {
    name: "Grote Markt",
    due_date: new Date(2023, 2, 6, 13, 30),
    start_time: new Date(2023, 2, 6, 13, 30),
    end_time: new Date(2023, 2, 6, 14, 0),
    student: "Emma",
    buildings: [
      {
        name: "Garcia",
        address: "Bruges, Belgium",
        start_time: new Date(2023, 2, 6, 16, 0),
        end_time: new Date(2023, 2, 6, 16, 10),
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        start_time: new Date(2023, 2, 6, 16, 20),
        end_time: new Date(2023, 2, 6, 16, 30),
        comments: false,
        amount_of_pics: 2,
      },
    ],
  },
  {
    name: "Vrijdagmarkt",
    due_date: new Date(2023, 2, 6, 16, 0),
    start_time: new Date(2023, 2, 6, 16, 0),
    end_time: null,
    student: "Sophie",
    buildings: [
      {
        name: "Garcia",
        address: "Bruges, Belgium",
        start_time: new Date(2023, 2, 6, 16, 0),
        end_time: new Date(2023, 2, 6, 16, 10),
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        start_time: null,
        end_time: null,
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Clark",
        address: "Ostend, Belgium",
        start_time: null,
        end_time: null,
        comments: false,
        amount_of_pics: 0,
      },
      {
        name: "Garcia",
        address: "Bruges, Belgium",
        start_time: null,
        end_time: null,
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        start_time: null,
        end_time: null,
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Clark",
        address: "Ostend, Belgium",
        start_time: null,
        end_time: null,
        comments: false,
        amount_of_pics: 0,
      },
    ],
  },
  {
    name: "Korenmarkt",
    due_date: new Date(2023, 2, 6, 12, 45),
    start_time: null,
    end_time: null,
    student: "Alex",
    buildings: [
      {
        name: "Garcia",
        address: "Bruges, Belgium",
        start_time: null,
        end_time: null,
        comments: true,
        amount_of_pics: 5,
      },
      {
        name: "Miller",
        address: "Leuven, Belgium",
        start_time: null,
        end_time: null,
        comments: false,
        amount_of_pics: 2,
      },
      {
        name: "Clark",
        address: "Ostend, Belgium",
        start_time: null,
        end_time: null,
        comments: false,
        amount_of_pics: 0,
      },
    ],
  },
];

// filter props to pass to largefilter component
const query_labels = ["Ronde", "Persoon"];
const filter_options = ["Klaar", "Bezig", "Niet begonnen", "Opmerkingen"];
const sort_items = ["Voortgang", "Gebouwen"];

// All the filter options
const filter_data = ref<FilterData>({
  query: "",
  search_label: query_labels[0],
  sort_by: sort_items[0],
  sort_ascending: true,
  filters: [],
  start_day: new Date(),
  end_day: new Date(),
});

function filter_query(round: Round): boolean {
  let search_by: string = "";
  switch (filter_data.value.search_label) {
    case query_labels[0]:
      search_by = round.name.toLowerCase();
      break;
    case query_labels[1]:
      search_by = round.student.toLowerCase();
      break;
  }
  return (
    search_by.includes(filter_data.value.query.toLowerCase()) ||
    filter_data.value.query.length == 0
  );
}

function filter_date(): boolean {
  // TODO: fix when rounds actually have dates
  return true;
}

function filter_filters(round: Round): boolean {
  if (filter_data.value.filters.length == 0) {
    return true;
  }
  let result: boolean = false;
  for (const option of filter_data.value.filters) {
    switch (option) {
      case "Klaar":
        result = completed_buildings(round) == round.buildings.length;
        break;
      case "Bezig":
        result =
          0 < completed_buildings(round) &&
          completed_buildings(round) < round.buildings.length;
        break;
      case "Niet begonnen":
        result = completed_buildings(round) == 0;
        break;
      case "Opmerkingen":
        result = round_has_comments(round);
        break;
    }
    if (result) {
      return result;
    }
  }
  return result;
}

function progress(done: number, total: number): number {
  return Math.round((done / total) * 100);
}

// The list of data after filtering
function filtered_data(): Round[] {
  const result: Round[] = [];
  // filtering
  mockrounds.forEach((elem) => {
    let can_add = true;

    // filter on query input
    can_add = can_add && filter_query(elem);
    // apply filter options
    can_add = can_add && filter_filters(elem);
    // apply the date filtering
    can_add = can_add && filter_date();

    if (can_add) {
      result.push(elem);
    }
  });

  // sort the results
  result.sort((a: Round, b: Round) => {
    if (filter_data.value.sort_by == "Gebouwen") {
      return a.buildings.length > b.buildings.length ? 1 : -1;
    } else {
      const ap = progress(completed_buildings(a), a.buildings.length);
      const bp = progress(completed_buildings(b), b.buildings.length);
      return ap > bp ? 1 : -1;
    }
  });
  // set sorting order
  if (!filter_data.value.sort_ascending) {
    result.reverse();
  }
  return result;
}
</script>
