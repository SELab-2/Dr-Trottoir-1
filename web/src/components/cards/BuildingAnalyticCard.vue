<template>
  <BorderCard prepend-icon="mdi-chart-box-outline">
    <template v-slot:title>Statistieken</template>
    <template v-slot:append>
      <DateRange
        v-model:end-date="fullSchemeEndDate"
        v-model:start-date="fullSchemeStartDate"
        @update:end-date="updateAnalytics()"
        @update:start-date="updateAnalytics()"
    /></template>
    <v-list v-if="thisBuildingAnalytics" class="mx-8">
      <v-list-item
        prepend-icon="mdi-briefcase-clock"
        :title="`Er is in dit gebouw ${formatTime(
          thisBuildingAnalytics?.total,
        )} gewerkt.`"
        :subtitle="`Er werd verwacht om ${formatTime(expectedTime)} in gebouw te werken.`"
      ></v-list-item>

    </v-list>
    <div v-else class="centre text-center pa-5">
      <v-icon icon="mdi-alert-circle" size="x-large" />
      <h3>Geen statistieken voor de gevraagde periode.</h3>
    </div>
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import DateRange from "@/components/filter/DateRange.vue";
import { Ref,ref, onMounted } from "vue";
import { BuildingAnalytics } from "@selab-2/groep-1-query/dist/building";
import { Result, BuildingQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const props = defineProps({
  id: { type: Number, required: true },
});

const expectedTime:Ref<number>= ref(0);

onMounted(() => {
  updateAnalytics();

  tryOrAlertAsync(async () => {
    thisBuilding.value = await new BuildingQuery().getOne(props.id);
  });
});

const thisBuildingAnalytics = ref<BuildingAnalytics>();
const thisBuilding = ref<Result<BuildingQuery>>();

const fullSchemeStartDate = ref<Date>(new Date());
const fullSchemeEndDate = ref<Date>(oneWeekLater());
function oneWeekLater() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate;
}

function formatTime(time: number | undefined) {
  if (time) {
    const hours: string = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const minutes: string = (Math.floor(time) % 60).toString().padStart(2, "0");

    return `${hours} uur en ${minutes} minuten`;
  } else {
    return "00:00";
  }
}

function calculateExpectedTime(start: Date, end: Date, expectedTime: number) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay));

  // Calculate proportion of the month (30 days)
  const proportionOfMonth = diffDays / 30;

  // Calculate expected time for the period.
  const expectedTimeForPeriod = proportionOfMonth * expectedTime;

  return Math.round(expectedTimeForPeriod);
}


function updateAnalytics() {
  fullSchemeStartDate.value.setHours(0, 0, 0, 0);
  fullSchemeEndDate.value.setHours(23, 59, 59, 999);
  tryOrAlertAsync(async () => {
    thisBuildingAnalytics.value = undefined;
    const analytics: BuildingAnalytics[] = await new BuildingQuery().getAnalytics(
      new Date(fullSchemeStartDate.value),
      new Date(fullSchemeEndDate.value),
    );
    for (const analytic of analytics) {
        console.log(analytic)
      if (analytic.name === thisBuilding.value?.name) {
        thisBuildingAnalytics.value = analytic;
        expectedTime.value = calculateExpectedTime(fullSchemeStartDate.value, fullSchemeEndDate.value, thisBuildingAnalytics.value?.expected || 0);
      }
    }
  });
}
</script>
