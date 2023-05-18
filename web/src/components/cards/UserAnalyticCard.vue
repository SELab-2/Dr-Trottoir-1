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
    <v-list v-if="thisStudentAnalytics" class="mx-8">
      <v-list-item
        prepend-icon="mdi-briefcase-clock"
        :title="`Deze student werkte ${formatTime(
          thisStudentAnalytics?.time,
        )}.`"
        :subtitle="`Andere studenten werkten gemiddeld ${formatTime(
          thisStudentAnalytics?.average,
        )}.`"
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
import { ref, onMounted } from "vue";
import { UserAnalytics } from "@selab-2/groep-1-query/dist/user";
import { Result, UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const props = defineProps({
  id: { type: Number, required: true },
});

onMounted(() => {
  updateAnalytics();

  tryOrAlertAsync(async () => {
    thisStudent.value = await new UserQuery().getOne(props.id);
  });
});

const thisStudentAnalytics = ref<UserAnalytics>();
const thisStudent = ref<Result<UserQuery>>();

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

function updateAnalytics() {
  fullSchemeStartDate.value.setHours(0, 0, 0, 0);
  fullSchemeEndDate.value.setHours(23, 59, 59, 999);
  tryOrAlertAsync(async () => {
    thisStudentAnalytics.value = undefined;
    console.log("HEY");
    const analytics: UserAnalytics[] = await new UserQuery().getAnalytics(
      new Date(fullSchemeStartDate.value),
      new Date(fullSchemeEndDate.value),
    );
    for (const analytic of analytics) {
      if (analytic.student === props.id) {
        thisStudentAnalytics.value = analytic;
      }
    }
  });
}
</script>
