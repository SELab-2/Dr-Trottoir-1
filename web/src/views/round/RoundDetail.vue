<template>
  <div v-if="data !== null">
    <HFillWrapper>
      <div class="space-y">
        <div style="margin-bottom: 0; display: flex; gap: 12px">
          <h2>{{ data.round.name }}</h2>
          <div class="flex-grow-1"></div>
          <CardLayout
            class="pa-1 d-flex align-center"
            style="border-radius: 30px"
            :to="{ name: 'account_settings', params: { id: data.user.id } }"
          >
            <Avatar
              size="small"
              :name="`${data.user.first_name} ${data.user.last_name}`"
            />
            <p class="ml-1" v-if="!mobile">
              {{ data.user.first_name }} {{ data.user.last_name }}
            </p>
          </CardLayout>
        </div>
        <RoundedButton
          icon="mdi-calendar"
          :value="new Date(data.day).toLocaleDateString()"
        ></RoundedButton>

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

        <v-timeline
          truncate-line="both"
          side="end"
          density="compact"
          align="start"
        >
          <v-timeline-item
            dot-color="success"
            icon="mdi-check"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">Start: 12u00</h3>
          </v-timeline-item>

          <v-timeline-item
            v-for="entry in data.round.buildings.map((e) => {
              return {
                building: e.building,
                progress: progressItems.get(e.building_id),
              };
            })"
            v-bind:key="entry.building.id"
            dot-color="success"
            icon="mdi-check"
            size="large"
            width="100%"
          >
            <RoundDetailCard :entry="entry" />
          </v-timeline-item>

          <v-timeline-item
            tag="TEST"
            dot-color="grey"
            icon="mdi-clock"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">Einde: 14u00</h3>
          </v-timeline-item>
        </v-timeline>
      </div>
    </HFillWrapper>
  </div>
  <AddButton icon="mdi-plus" :items="actions" v-if="mobile" />
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import RoundDetailCard from "@/components/cards/RoundDetailCard.vue";
import Avatar from "@/components/Avatar.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import Button from "@/components/models/Button";
import { ProgressQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

const actions: Button[] = [
  {
    title: "Foto toevoegen",
    clicked: () => console.log("foto"),
  },
  {
    title: "Opmerking toevoegen",
    clicked: () => console.log("opmerking"),
  },
  {
    title: "Bezoek beëindigen",
    clicked: () => console.log("einde"),
  },
];

const route = useRoute();
const schedule_id: number = Number(route.params.schedule);

const data: Ref<Result<ScheduleQuery> | null> = ref(null);
const progressItems: Ref<Map<Number, Result<ProgressQuery>>> = ref(new Map());

const display = useDisplay();
const mobile = display.mobile;

tryOrAlertAsync(async () => {
  data.value = await new ScheduleQuery().getOne(schedule_id);
});

tryOrAlertAsync(async () => {
  for (const progress of await new ProgressQuery().getAll()) {
    progressItems.value.set(progress.building_id, progress);
  }
});
</script>

<style lang="sass" scoped>
.space-y
  max-width: 100%
  & > *
    margin-bottom: 24px
</style>
