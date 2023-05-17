<template>
  <BorderCard prepend-icon="mdi-chart-box-outline" :title="`Statistieken`"
    ><div class="d-flex my-2 mx-5">
      <v-text-field
        class="mr-1"
        v-model="fullSchemeStartDate"
        prepend-inner-icon="mdi-calendar"
        variant="outlined"
        type="date"
        label="Startdatum"
        @update:model-value="updateAnalytics()"
      ></v-text-field>
      <v-text-field
        class="ml-1"
        v-model="fullSchemeEndDate"
        prepend-inner-icon="mdi-calendar"
        variant="outlined"
        type="date"
        label="Einddatum"
        @update:model-value="updateAnalytics()"
      ></v-text-field>
    </div>
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
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

const fullSchemeStartDate = ref<string>(
  new Date().toISOString().substring(0, 10),
);
const fullSchemeEndDate = ref<string>(oneWeekLater());
function oneWeekLater() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate.toISOString().substring(0, 10);
}

function updateAnalytics() {
  tryOrAlertAsync(async () => {
    const analytics: UserAnalytics[] = await new UserQuery().getAnalytics(
      new Date(fullSchemeStartDate.value),
      new Date(fullSchemeEndDate.value),
    );
    console.log(analytics);

    for (const analytic of analytics) {
      if (analytic.student === props.id) {
        thisStudentAnalytics.value = analytic;
        console.log(thisStudentAnalytics.value);
      }
    }
  });
}
</script>
