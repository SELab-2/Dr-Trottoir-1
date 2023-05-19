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
      v-if="filtered.length === 0"
      color="background"
      variant="flat"
      subtitle="Er zijn geen rondes ingepland voor de geselecteerde data."
    />
    <!-- TODO: fix comment when db ready for it-->
    <RoundCard
      v-for="schedule in filtered"
      :key="schedule.schedule.id"
      :schedule="schedule.schedule"
      :amountOfComments="schedule.amountOfComments"
      :completedBuildings="schedule.completedBuildings"
      :roundEnd="schedule.roundEnd"
      :roundStart="schedule.roundStart"
      :roundDate="schedule.roundDate"
      :roundName="schedule.roundName"
      :studentName="schedule.studentName"
      :totalBuildings="schedule.totalBuildings"
      :roundProgress="schedule.roundProgress"
      @click="
        redirect_to_detail(schedule.schedule.round_id, schedule.schedule.id)
      "
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

const filtered: Ref<Array<FilteredSchedule>> = ref([]);

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
  roundProgress: number;
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
    await tryOrAlertAsync(async () => {
      const progresses = await new ProgressQuery().getAll({
        schedule: schedule.id,
      });

      const completed = getCompletedBuildings(progresses);

      filteredSchedules.push({
        schedule: schedule,
        progresses: progresses,
        roundName: schedule.round.name,
        roundStart: schedule.start,
        roundEnd: schedule.end,
        roundDate: schedule.day,
        studentName: schedule.user.first_name,
        completedBuildings: completed,
        totalBuildings: schedule.round.buildings.length,
        amountOfComments: getCommentsAmount(progresses),
        roundProgress: Math.round(
          (completed / schedule.round.buildings.length) * 100,
        ),
      });
    });
  }

  // apply filters
  filteredSchedules = filtered_data(filteredSchedules);

  filtered.value = filteredSchedules;
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

handleFilterUpdate(filter_data.value);

/* Data filtering */
async function handleFilterUpdate(data: FilterData) {
  filter_data.value = data;
  filter_data.value.start_day.setHours(0, 0, 0, 0);
  filter_data.value.end_day.setHours(23, 59, 59, 999);
  await updateSchedules();
}

// The list of data after filtering
function filtered_data(schedules: FilteredSchedule[]): FilteredSchedule[] {
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
  result.sort((a: FilteredSchedule, b: FilteredSchedule) => {
    return a.roundProgress > b.roundProgress ? 1 : -1;
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
        result = schedule.roundEnd !== null;
        break;
      case "Bezig":
        result = schedule.roundStart !== null && schedule.roundEnd === null;
        break;
      case "Niet begonnen":
        result = schedule.roundStart === null;
        break;
    }
    if (result) {
      return result;
    }
  }
  return result;
}
</script>
