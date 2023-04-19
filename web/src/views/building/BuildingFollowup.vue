<template>
  <HFillWrapper>
    <LargeFilter
      :search_by_labels="query_labels"
      :sort_items="sort_items"
      :filter_items="filter_options"
      class="mx-1 mb-3"
      @onUpdate="(new_data: Filterdata) => {filter_data = new_data; filterIndex++; updateBuildings()}"
    />
    <building-card
      :building="building"
      :start_date="filter_data.start_day"
      :end_date="filter_data.end_day"
      v-for="(building, id) in filteredBuildings"
      :key="id + ':' + filterIndex"
    />
  </HFillWrapper>
</template>

<script lang="ts" setup>
import LargeFilter from "@/components/filter/LargeFilter.vue";
import Filterdata from "@/components/filter/FilterData";
import { ref, Ref, onMounted } from "vue";
import BuildingCard from "@/components/cards/BuildingCard.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import { Result, BuildingQuery } from "@selab-2/groep-1-query";
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
const filterIndex = ref<number>(0);

let filteredBuildings: Ref<Result<BuildingQuery>[]> = ref([]);

async function updateBuildings() {
  tryOrAlertAsync(async () => {
    filteredBuildings.value = await new BuildingQuery().getAll({});
  });
}
onMounted(() => {
  updateBuildings();
});
</script>

<style scoped lang="scss"></style>
