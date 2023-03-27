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
        @onUpdate="(new_data: Filterdata) => filter_data = new_data"
      />
      <div v-for="building in filter()" :key="building.id + filter_data.filter_label">
        <v-card
          class='pa-4 my-4'
          @click="
            this.$router.push({
              name: 'Gebouw detail',
              params: { id: building.id, date: building.date},
            })
          "
        >
          <template v-slot:title>
            {{ building.name }}
            <v-icon end v-if="building.comments">mdi-comment-alert-outline</v-icon>
          </template>
          <template v-slot:subtitle>
            <Avatar :name="building.syndicus" size="x-small" />
            {{ building.syndicus }}
          </template>
          <template v-slot:append v-if='filter_data.filter_label === filter_labels[1]'>
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
import { ref } from 'vue'
import Avatar from '@/components/Avatar.vue'
import { formatDate } from '@/assets/scripts/format'

const query_labels = ["Gebouw", "Syndicus", "Adres"];
const filter_labels = ["Naam", "Naam + Datum"];
const filter_options = ["Opmerkingen"];
const sort_items = ["Naam", "Datum"];

const today: Date = new Date();

// All the filter options
const filter_data = ref<Filterdata>({
  query: "",
  search_label: query_labels[0],
  filter_label: filter_labels[0],
  sort_by: sort_items[0],
  sort_ascending: true,
  filters: [],
  start_day: new Date(),
  end_day: new Date(),
});

// TODO: mockdata, remove in future
const buildings: any[] = [
  {
    id: 11,
    name: "Eiffeltoren",
    syndicus: "Mats Van Belle",
    adres: "Examplestreet -2",
    comments: true,
    date: "15/3/2023",
  },
  {
    id: 12,
    name: "Eiffeltoren",
    syndicus: "Mats Van Belle",
    adres: "Examplestreet -2",
    comments: false,
    date: "13/3/2023",
  },
  {
    id: 21,
    name: "Taj Mahal",
    syndicus: "Brent Matthys",
    adres: "Nieuwestraat 8",
    comments: false,
    date: "27/3/2023",
  },
  {
    id: 31,
    name: "Machu Picchu",
    syndicus: "Arne Vanheule",
    adres: "Voorbeeldstraat 22",
    comments: true,
    date: "24/3/2023",
  },
  {
    id: 32,
    name: "Machu Picchu",
    syndicus: "Arne Vanheule",
    adres: "Voorbeeldstraat 22",
    comments: true,
    date: "19/3/2023",
  },
  {
    id: 33,
    name: "Machu Picchu",
    syndicus: "Arne Vanheule",
    adres: "Voorbeeldstraat 22",
    comments: false,
    date: "07/3/2023",
  },
  {
    id: 4,
    name: "Toren van Pisa",
    syndicus: "Mats Van Belle",
    adres: "Italiëwegel 345",
    comments: false,
    date: "07/3/2023",
  },
];

function filter() {
  const result: any[] = [];
  // filtering
  buildings.forEach((elem) => {
    let can_add = true;

    for (let filter of filter_data.value.filters)
    {
      if(filter === filter_options[0])
      {
        can_add = can_add && elem.comments;
      }
    }

    if (can_add) {
      let newel = {...elem};
      if(filter_data.value.filter_label === filter_labels[0]){
        newel.date = formatDate(today);
      }
      result.push(newel);
    }
  });

  // sort the results
  result.sort((a, b) => a.name > b.name ? 1 : -1);
  result.sort((a, b) => {
    if (filter_data.value.sort_by == "Datum" ) {
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
