<template>
  <HFillWrapper>
    <LargeFilter
      :search_by_labels="query_labels"
      :sort_items="sort_items"
      :filter_items="filter_options"
      class="mx-1 mb-3"
      @onUpdate="(new_data: Filterdata) => {filter_data = new_data; filterIndex++;}"
    />
    <building-card
      :building="building"
      v-for="(building, id) in filter()"
      :key="id + ':' + filterIndex"
    />
  </HFillWrapper>
</template>

<script lang="ts" setup>
import LargeFilter from "@/components/filter/LargeFilter.vue";
import Filterdata from "@/components/filter/FilterData";
import { ref } from "vue";
import { createDate, formatDate } from "@/assets/scripts/date";
import BuildingCard from "@/components/building/BuildingCard.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

const query_labels = ["Gebouw", "Syndicus", "Adres"];
const filter_options = ["Opmerkingen"];
const sort_items: string[] = [];

// All the filter options
const filter_data = ref<Filterdata>({
  query: "",
  search_label: query_labels[0],
  sort_by: "",
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
    expanded: false,
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
  const result: any[] = [];
  // filtering
  buildings.forEach((elem) => {
    const building = { ...elem };

    if (filter_query(building)) {
      const data = [];
      building.data.forEach((datum: { comments: boolean; date: string }) => {
        let can_add = true;

        can_add =
          can_add &&
          createDate(datum.date) <= createDate(filter_data.value.end_day);
        can_add =
          can_add &&
          createDate(datum.date) >= createDate(filter_data.value.start_day);

        for (let filter of filter_data.value.filters) {
          if (filter === filter_options[0]) {
            can_add = can_add && datum.comments;
          }
        }
        if (can_add) {
          data.push(datum);
        }
      });

      if (
        data.length === 0 &&
        filter_data.value.end_day === filter_data.value.start_day
      ) {
        data.push({ date: filter_data.value.start_day, comments: false });
      }

      data.sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });

      if (!filter_data.value.sort_ascending) {
        data.reverse();
      }

      building.data = data;

      result.push(building);
    }
  });

  result.sort((a, b) => (a.name > b.name ? 1 : -1));

  if (!filter_data.value.sort_ascending) {
    result.reverse();
  }

  return result;
}
</script>

<style scoped lang="scss"></style>
