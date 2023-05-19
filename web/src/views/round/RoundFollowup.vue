<template>
  <HFillWrapper>
    <LargeFilter
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
      :schedule="schedule"
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
import {
  getCompletedBuildings,
  getCommentsAmount,
} from "@/assets/scripts/roundProgress";
import { ScheduleQuery, ProgressQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

// the router constant
const router = useRouter();

// filter props to pass to largefilter component
const query_labels = ["Ronde", "Student"];
const filter_options = ["Klaar", "Bezig", "Niet begonnen"];
const sort_items = ["Voortgang"];

const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);
const progress = ref<Map<Result<ScheduleQuery>, number>>(); // completed buildings of each schedule

// fetch the schedules, for today
/**
 * Update the schedules state with new schedules
 */
interface FilteredSchedule {
  schedule: Result<ScheduleQuery>;
  progresses: Result<ProgressQuery>[];
  roundName: string;
  roundStart: Date | null;
  roundEnd: Date | null;
  roundDate: Date;
  studentName: string;
  completedBuildings: number;
  totalBuildings: number;
  amountOfComments: number;
}

async function updateSchedules() {
  // fetch schedules

  let filteredSchedules: FilteredSchedule[] = [];
  let schedules: Array<Result<ScheduleQuery>> = [];
  await tryOrAlertAsync(async () => {
    schedules = await new ScheduleQuery().getAll({
      after: filter_data.value.start_day,
      before: filter_data.value.end_day,
      //sort: [filter_data.value.sort_by],
      //ord: (filter_data.value.sort_ascending ? ['asc'] : ['desc']),
    });
  });

  for (const schedule of schedules) {
    tryOrAlertAsync(async () => {
      const progresses = await new ProgressQuery().getAll({
        schedule: schedule.id,
      });

      filteredSchedules.push({
        schedule: schedule,
        progresses: progresses,
        roundName: schedule.round.name,
        roundStart: schedule.start,
        roundEnd: schedule.end,
        roundDate: schedule.day,
        studentName: schedule.user.first_name,
        completedBuildings: getCompletedBuildings(progresses),
        totalBuildings: schedule.round.buildings.length,
        amountOfComments: getCommentsAmount(progresses),
      });
    });
  }

  // apply filters
  filteredSchedules = filtered_data(filteredSchedules);

  schedules.value = schedules;
}

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

handleFilterUpdate(filter_data.value);

/* Data filtering */
async function handleFilterUpdate(data: FilterData) {
  filter_data.value = data;
  // set at start of the day
  filter_data.value.start_day.setHours(0, 0, 0, 0);
  // set at end of the day
  filter_data.value.end_day.setHours(23, 59, 59, 999);
  await updateSchedules();
}


function progressOfSchedule(schedule: Result<ScheduleQuery>): number {
  return progress.value?.get(schedule)!;
}


function calculateProgress(done: number, total: number): number {
  return Math.round((done / total) * 100);
}

// The list of data after filtering
function filtered_data(
  schedules: FilteredSchedule[],
): FilterData[] {
  const result: FilteredSchedule[] = [];
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


function filter_query(schedule: FilteredSchedule): boolean {
  let search_by: string = "";
  switch (filter_data.value.search_label) {
    case query_labels[0]:
      search_by = schedule.roundName.toLowerCase();
      break;
    case query_labels[1]:
      search_by = schedule.studentName.toLowerCase();
      break;
  }
  return (
    search_by.includes(filter_data.value.query.toLowerCase()) ||
    filter_data.value.query.length == 0
  );
}


function filter_filters(schedule: FilteredSchedule): boolean {
  if (filter_data.value.filters.length == 0) {
    return true;
  }
  let result: boolean = false;
  for (const option of filter_data.value.filters) {
    switch (option) {
      case "Klaar":
        result = schedule.roundEnd !== null
        break;
      case "Bezig":
        result = (schedule.roundStart !== null) && (schedule.roundEnd === null)
        break;
      case "Niet begonnen":
        result = schedule.roundStart === null
        break;
    }
    if (result) {
      return result;
    }
  }
  return result;
}
</script>
