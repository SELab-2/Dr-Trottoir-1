<template>
  <HFillWrapper>
    <LargeFilter
      id="filter"
      :search_by_labels="query_labels"
      :sort_items="sort_items"
      :filter_items="filter_options"
      class="mx-1 mb-3"
      @onUpdate="
        async (new_data: FilterData) => {
          await handleFilterUpdate(new_data);
        }
      "
    />
    <v-card
      v-if="schedules.length === 0"
      color="background"
      variant="flat"
      subtitle="Er zijn geen rondes ingepland voor de geselecteerde data."
    />
    <!-- TODO: fix comment when db ready for it-->
    <RoundCard
      v-for="(schedule, i) in schedules"
      :key="i"
      :round_name="schedule.round.name"
      round_start=""
      round_end=""
      :student_name="schedule.user.first_name"
      :building_index="progress?.get(schedule)!"
      :total_buildings="schedule.round.buildings.length"
      :round_comments="progress?.get(schedule)! != 0"
      :date="new Date(schedule.day)"
      @click="redirect_to_detail(schedule.round_id, schedule.id)"
      style="cursor: pointer"
    ></RoundCard>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import RoundCard from "@/components/cards/RoundCard.vue";
import LargeFilter from "@/components/filter/LargeFilter.vue";
import { useRouter } from "vue-router";
import { Ref, ref } from "vue";
import FilterData from "@/components/filter/FilterData";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

import { ScheduleQuery, ProgressQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

// the router constant
const router = useRouter();

// filter props to pass to largefilter component
const query_labels = ["Ronde", "Persoon"];
const filter_options = ["Klaar", "Bezig", "Niet begonnen"];
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

function redirect_to_detail(round_id: number, schedule_id: number) {
  router.push({
    name: "round_detail",
    params: { id: round_id, schedule: schedule_id },
  });
}

/* Data fetching */

//interface ExtendedSchedule extends Result<ScheduleQuery>, Result<ProgressQuery> {};

async function fetchBuildingProgress(
  schedule_id: number,
  building_id: number,
): Promise<Result<ProgressQuery> | null> {
  let result: Array<Result<ProgressQuery>> = [];
  await tryOrAlertAsync(async () => {
    result = await new ProgressQuery().getAll({
      schedule: schedule_id,
      building: building_id,
    });
  });
  return result.length == 0 ? null : result[0];
}

async function completedBuildings(
  schedule: Result<ScheduleQuery>,
): Promise<number> {
  let count = 0;
  for (const building of schedule.round.buildings) {
    const progress = await fetchBuildingProgress(
      schedule.id,
      building.building_id,
    );
    if (progress) {
      count++;
    }
  }
  return count;
}

const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);
const progress = ref<Map<Result<ScheduleQuery>, number>>(); // completed buildings of each schedule

// fetch the schedules, for today
handleFilterUpdate(filter_data.value);

/**
 * Update the schedules state with new schedules
 */
async function updadeSchedules() {
  // fetch schedules
  let result: Array<Result<ScheduleQuery>> = [];
  await tryOrAlertAsync(async () => {
    result = await new ScheduleQuery().getAll({
      after: filter_data.value.start_day,
      before: filter_data.value.end_day,
      //sort: [filter_data.value.sort_by],
      //ord: (filter_data.value.sort_ascending ? ['asc'] : ['desc']),
    });
  });
  // fetch progress
  const newProgress = new Map();
  for (const schedule of result) {
    newProgress.set(schedule, await completedBuildings(schedule));
  }
  progress.value = newProgress;

  // apply filters
  result = filtered_data(result);

  schedules.value = result;
}

/* Data filtering */
async function handleFilterUpdate(data: FilterData) {
  filter_data.value = data;
  // set at start of the day
  filter_data.value.start_day.setHours(0, 0, 0, 0);
  // set at end of the day
  filter_data.value.end_day.setHours(23, 59, 59, 999);
  await updadeSchedules();
}

//Filtering TODO: replace with API calls

function filter_query(schedule: Result<ScheduleQuery>): boolean {
  let search_by: string = "";
  switch (filter_data.value.search_label) {
    case query_labels[0]:
      search_by = schedule.round.name.toLowerCase();
      break;
    case query_labels[1]:
      search_by = schedule.user.first_name.toLowerCase();
      break;
  }
  return (
    search_by.includes(filter_data.value.query.toLowerCase()) ||
    filter_data.value.query.length == 0
  );
}

function progressOfSchedule(schedule: Result<ScheduleQuery>): number {
  return progress.value?.get(schedule)!;
}

function filter_filters(schedule: Result<ScheduleQuery>): boolean {
  if (filter_data.value.filters.length == 0) {
    return true;
  }
  let result: boolean = false;
  for (const option of filter_data.value.filters) {
    switch (option) {
      case "Klaar":
        result =
          progressOfSchedule(schedule) == schedule.round.buildings.length;
        break;
      case "Bezig":
        result =
          0 < progressOfSchedule(schedule) &&
          progressOfSchedule(schedule) < schedule.round.buildings.length;
        break;
      case "Niet begonnen":
        result = progressOfSchedule(schedule) == 0;
        break;
    }
    if (result) {
      return result;
    }
  }
  return result;
}

function calculateProgress(done: number, total: number): number {
  return Math.round((done / total) * 100);
}

// The list of data after filtering
function filtered_data(
  schedules: Result<ScheduleQuery>[],
): Result<ScheduleQuery>[] {
  const result: Result<ScheduleQuery>[] = [];
  // filtering
  schedules.forEach((schedule) => {
    let can_add = true;

    // filter on query input
    can_add = can_add && filter_query(schedule);
    // apply filter options
    can_add = can_add && filter_filters(schedule);

    if (can_add) {
      result.push(schedule);
    }
  });

  // sort the results
  result.sort((a: Result<ScheduleQuery>, b: Result<ScheduleQuery>) => {
    if (filter_data.value.sort_by == "Gebouwen") {
      return a.round.buildings.length > b.round.buildings.length ? 1 : -1;
    } else {
      const ap = calculateProgress(
        progressOfSchedule(a),
        a.round.buildings.length,
      );
      const bp = calculateProgress(
        progressOfSchedule(b),
        b.round.buildings.length,
      );
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
