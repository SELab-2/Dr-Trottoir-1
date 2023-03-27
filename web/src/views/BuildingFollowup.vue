<template>
  <v-row class="mt-1">
    <v-col cols="1" class="flex-grow-1 flex-shrink-0" style="max-width: 100%" />
    <v-col cols="7" style="min-width: 400px">
      <LargeFilter
        :search_by_labels="query_labels"
        :filter_labels="filter_labels"
        :sort_items="sort_items"
        :filter_items="filter_options"
        class="mx-1 mb-3"
        @onUpdate="(new_data: Filterdata) => {filter_data = new_data; filterIndex++;}"
      />
      <div v-for="(building, id) in filter()" :key="id + filterIndex">
        <v-card
          class="mb-3 mx-1 pb-2"
          @click="
            router.push({
              name: 'Gebouw detail',
              params: { id: building.id, date: building.date },
            })
          "
        >
          <template v-slot:title>
            {{ building.name }}
            <v-icon end v-if="building.comments"
              >mdi-comment-alert-outline</v-icon
            >
          </template>
          <template v-slot:subtitle>
            <Avatar
              :name="building.syndicus"
              size="x-small"
              :key="building.syndicus"
            />
            {{ building.syndicus }}
          </template>
          <template
            v-slot:append
            v-if="filter_data.filter_label === filter_labels[1]"
          >
            <v-chip label color="blue" class="ml-3">
              <v-icon icon="mdi-calendar-clock"></v-icon>
              <p class="ml-2">{{ building.date }}</p>
            </v-chip>
          </template>
          <v-chip label color="brown" class="ml-3">
            <v-icon icon="mdi-office-building-marker-outline"></v-icon>
            <p class="ml-2">{{ building.adres }}</p>
          </v-chip>
        </v-card>
      </div>
      <v-spacer></v-spacer>
    </v-col>
    <v-col cols="1" class="flex-grow-1 flex-shrink-0" style="max-width: 100%">
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import LargeFilter from "@/components/LargeFilter.vue";
import Filterdata from "@/components/models/Filterdata";
import Avatar from "@/components/Avatar.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createDate, formatDate } from "@/assets/scripts/date";

const router = useRouter();

const query_labels = ["Gebouw", "Syndicus", "Adres"];
const filter_labels = ["Naam", "Naam + Datum"];
const filter_options = ["Opmerkingen"];
const sort_items = ["Naam", "Datum"];

// All the filter options
const filter_data = ref<Filterdata>({
  query: "",
  search_label: query_labels[0],
  filter_label: filter_labels[0],
  sort_by: sort_items[0],
  sort_ascending: true,
  filters: [],
  start_day: formatDate(new Date()),
  end_day: formatDate(new Date()),
});

const filterIndex = ref<number>(0);

// TODO: mockdata, remove in future
const buildings: any[] = [
  {
    id: 1,
    name: "Eiffeltoren",
    syndicus: "Mats Van Belle",
    adres: "Examplestreet -2",
    data: [
      {
        comments: true,
        date: "15/3/2023",
      },
      {
        comments: false,
        date: "13/3/2023",
      },
    ],
  },
  {
    id: 2,
    name: "Taj Mahal",
    syndicus: "Brent Matthys",
    adres: "Nieuwestraat 8",
    data: [
      {
        comments: true,
        date: "15/3/2023",
      },
      {
        comments: false,
        date: "27/3/2023",
      },
    ],
  },
  {
    id: 3,
    name: "Machu Picchu",
    syndicus: "Arne Vanheule",
    adres: "Voorbeeldstraat 22",
    data: [
      {
        comments: true,
        date: "15/3/2023",
      },
    ],
  },
  {
    id: 4,
    name: "Toren van Pisa",
    syndicus: "Mats Van Belle",
    adres: "Italiëwegel 345",
    data: [
      {
        comments: false,
        date: "07/3/2023",
      },
      {
        comments: false,
        date: "27/3/2023",
      },
    ],
  },
];

function filter_query(building: {
  name: string;
  syndicus: string;
  adres: string;
}): boolean {
  let search_by: string = "";
  switch (filter_data.value.search_label) {
    case query_labels[0]:
      search_by = building.name.toLowerCase();
      break;
    case query_labels[1]:
      search_by = building.syndicus.toLowerCase();
      break;
    case query_labels[2]:
      search_by = building.adres.toLowerCase();
      break;
  }
  return (
    search_by.includes(filter_data.value.query.toLowerCase()) ||
    filter_data.value.query.length == 0
  );
}

function filter() {
  const prefilter: any[] = [];
  const result: any[] = [];
  // filtering
  buildings.forEach((elem) => {
    if (filter_data.value.filter_label === filter_labels[0]) {
      let newel = { ...elem };
      newel.date = filter_data.value.start_day;
      newel.comments = false;
      prefilter.push(newel);
    } else {
      for (const datum of elem.data) {
        let newel = { ...elem };
        newel.date = datum.date;
        newel.comments = datum.comments;
        prefilter.push(newel);
      }
    }
  });

  prefilter.forEach((elem) => {
    let can_add = true;

    can_add = can_add && filter_query(elem);

    can_add =
      can_add && createDate(elem.date) <= createDate(filter_data.value.end_day);
    can_add =
      can_add &&
      createDate(elem.date) >= createDate(filter_data.value.start_day);

    for (let filter of filter_data.value.filters) {
      if (filter === filter_options[0]) {
        can_add = can_add && elem.comments;
      }
    }
    if (can_add) {
      result.push(elem);
    }
  });

  // sort the results
  result.sort((a, b) => (a.name > b.name ? 1 : -1));
  result.sort((a, b) => {
    if (filter_data.value.sort_by == "Datum") {
      return a.date > b.date ? 1 : -1;
    }
    return 0;
  });
  // set sorting order
  if (!filter_data.value.sort_ascending) {
    result.reverse();
  }
  return result;
}
</script>

<style scoped lang="scss"></style>
