<template>
  <div v-if="data !== null">
    <HFillWrapper>
      <div class="space-y">
        <div class="header">
          <h2>{{ data.round.name }}</h2>
          <div class="flex-grow-1"></div>
          <div class="header-buttons">
            <RoundedButton
              icon="mdi-calendar"
              :value="new Date(data.day).toLocaleDateString()"
            ></RoundedButton>
            <RoundedButton
              icon="mdi-account"
              :value="data.user.first_name + ' ' + data.user.last_name"
              @click="
                () =>
                  router.push({
                    name: 'account_settings',
                    params: { id: data.user.id },
                  })
              "
            ></RoundedButton>
          </div>
        </div>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <divider-layout class="my-8"></divider-layout>

        <Progress
          v-for="entry in data.round.buildings.map((e) => {
            return {
              building: e.building,
              progress: progressItems.get(e.building_id),
            };
          })"
          v-bind:key="entry.building.id"
          :building="entry.building"
          :progress="entry.progress"
        ></Progress>
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

  for (const progress of await new ProgressQuery().getAll({
    schedule: schedule_id,
  })) {
    progressItems.value.set(progress.building_id, progress);
  }

  /*if (progressItems.value.size !== data.value?.round.buildings.length) {
    throw new Error("Not every building has a progress item");
  }*/
});
</script>

<style lang="sass">
.space-y
  & > *
    margin-bottom: 24px

.header
  display: flex
  align-items: center
  gap: 12px

  @media (max-width: 700px)
    flex-direction: column

.header-buttons
  display: flex
  align-items: center
  gap: 12px
</style>
