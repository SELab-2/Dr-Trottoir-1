<template>
  <HFillWrapper>
    <LargeFilter
      :search_by_labels="query_labels"
      :sort_items="sort_items"
      :filter_items="filter_options"
      class="mx-1 mb-3"
      @onUpdate="(new_data: Filterdata) => {filter_data = new_data; getBuildings()}"
    />
    <building-card
      :building="building"
      :filter_data='filter_data'
      v-for="building in buildings"
      :key="building.id + ':' + JSON.stringify(filter_data)"
    />
  </HFillWrapper>
</template>

<script lang="ts" setup>
import LargeFilter from "@/components/filter/LargeFilter.vue";
import Filterdata from "@/components/filter/FilterData";
import { ref, Ref } from "vue";
import BuildingCard from "@/components/cards/BuildingCard.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import { Result, BuildingQuery } from '@selab-2/groep-1-query'
import { tryOrAlertAsync } from "@/try";

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
  start_day: new Date(),
  end_day: new Date(),
});

let buildings: Ref<Result<BuildingQuery>[]> = ref([]);

function full_syndicus_name(building: Result<BuildingQuery>) {
  const user = building.syndicus?.user;
  return user?.first_name + " " + user?.last_name;
}

function full_address(building: Result<BuildingQuery>) {
  const addressprops = building.address;
  return (
    addressprops.street + " " + addressprops.number + " " + addressprops.city
  );
}

function filterQuery(buildings: Array<Result<BuildingQuery>>) {
  return buildings.filter((building) => {
    switch (filter_data.value.search_label) {
      case "Gebouw": {
        return building.name.toLowerCase().includes(filter_data.value.query.toLowerCase());
      }
      case "Syndicus": {
        return full_syndicus_name(building).toLowerCase().includes(filter_data.value.query.toLowerCase());
      }
      case "Adres": {
        return full_address(building).toLowerCase().includes(filter_data.value.query.toLowerCase());
      }
      default: {
        return true;
      }
    }

  });
}

async function getBuildings() {
  await tryOrAlertAsync(async () => {
    const result = await new BuildingQuery().getAll({});
    buildings.value = filterQuery(result);
  });
}
await getBuildings();

</script>

<style scoped lang="scss"></style>
