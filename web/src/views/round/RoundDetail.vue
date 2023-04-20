<template>
  <div v-if="data !== null">
    <HFillWrapper>
      <div class="space-y">
        <div
          style="
            margin-left: 70px;
            display: flex;
            align-items: center;
            gap: 12px;
          "
        >
          <h2>{{ data.round.name }}</h2>
          <div class="flex-grow-1"></div>
          <RoundedButton
            icon="mdi-calendar"
            :value="new Date(data.day).toLocaleDateString()"
          ></RoundedButton>
          <RoundedButton
            icon="mdi-account"
            :value="data.user.first_name + ' ' + data.user.last_name"
            @click="() => router.push({ name: 'account_settings', params: { id: data.user.id } })"
          ></RoundedButton>
        </div>

        <p style="margin-left: 70px">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <divider-layout class="my-8" style="margin-left: 70px"></divider-layout>

        <v-timeline truncate-line="both" side="end" density="compact">
          <v-timeline-item :dot-color="'success'" :icon="'mdi-check'">
            <h3>Start: 12u00</h3>
          </v-timeline-item>

          <v-timeline-item
            v-for="entry in data.round.buildings.map((e) => {
              return {
                building: e.building,
                progress: progressItems.get(e.building_id),
              };
            })"
            v-bind:key="entry.building.id"
            :dot-color="'success'"
            :icon="'mdi-check'"
            :size="'large'"
          >
            <Progress :building="entry.building" :progress="entry.progress"></Progress>
          </v-timeline-item>

          <v-timeline-item
            :tag="'TEST'"
            :dot-color="'grey'"
            :icon="'mdi-clock'"
          >
            <h3>Einde: 14u00</h3>
          </v-timeline-item>
        </v-timeline>
      </div>
    </HFillWrapper>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import { ProgressQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import { useRoute } from "vue-router";
import Progress from "@/components/round/Progress.vue";
import router from "@/router";

const route = useRoute();
const schedule_id: number = Number(route.params.schedule);

const data: Ref<Result<ScheduleQuery> | null> = ref(null);
const progressItems: Ref<Map<Number, Result<ProgressQuery>>> = ref(new Map());

tryOrAlertAsync(async () => {
  data.value = await new ScheduleQuery().getOne(schedule_id);
});

tryOrAlertAsync(async () => {
  for (const progress of await new ProgressQuery().getAll()) {
    progressItems.value.set(progress.building_id, progress);
  }
});
</script>

<style lang="sass">
.space-y
  & > *
    margin-bottom: 24px
</style>
