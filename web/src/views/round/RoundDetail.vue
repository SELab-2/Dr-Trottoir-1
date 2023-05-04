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
        <p>
          <v-icon icon="mdi-calendar" />
          {{ new Date(data.day).toLocaleDateString("nl") }}
        </p>

        <!-- TODO add description (not in api)
        <p>
        </p>

        <divider-layout class="my-8"></divider-layout>-->

        <v-timeline
          truncate-line="both"
          side="end"
          density="compact"
          align="start"
        >
          <v-timeline-item
            v-if="
              progressItems.get(data.round.buildings[0].building_id)?.arrival
            "
            dot-color="success"
            icon="mdi-check"
            size="large"
            width="100%"
            :set="
              (firstBuilding = progressItems.get(
                data.round.buildings[0].building_id,
              ))
            "
          >
            <h3 class="pt-2">
              Start:
              {{
                new Date(firstBuilding.arrival).toLocaleTimeString("nl", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </h3>
          </v-timeline-item>
          <v-timeline-item
            v-else
            dot-color="grey"
            icon="mdi-clock"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">Ronde nog niet begonnen.</h3>
          </v-timeline-item>

          <v-timeline-item
            v-for="entry in data.round.buildings.map((e) => {
              return {
                building: e.building,
                progress: progressItems.get(e.building_id),
              };
            })"
            v-bind:key="entry.building.id"
            :dot-color="entry.progress?.departure ? 'success' : 'grey'"
            :icon="entry.progress?.departure ? 'mdi-check' : 'mdi-clock'"
            size="large"
            width="100%"
          >
            <RoundDetailCard
              :key="entry.progress?.id"
              :entry="entry"
              @start="roundUpdated(entry.progress?.id)"
              @end="roundUpdated(entry.progress?.id)"
            />
          </v-timeline-item>

          <v-timeline-item
            v-if="
              progressItems.get(
                data.round.buildings[data.round.buildings.length - 1]
                  .building_id,
              )?.departure
            "
            dot-color="success"
            icon="mdi-check"
            size="large"
            width="100%"
            :set="
              (lastBuilding = progressItems.get(
                data.round.buildings[data.round.buildings.length - 1]
                  .building_id,
              ))
            "
          >
            <h3 class="pt-2">
              Einde:
              {{
                new Date(lastBuilding.departure).toLocaleTimeString("nl", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </h3>
          </v-timeline-item>
          <v-timeline-item
            v-else
            dot-color="grey"
            icon="mdi-clock"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">Ronde nog niet beëindigt.</h3>
          </v-timeline-item>
        </v-timeline>
      </div>
    </HFillWrapper>
  </div>
  <AddButton
    icon="mdi-plus"
    :items="actions"
    title="Building 1"
    v-if="mobile"
  />
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import Avatar from "@/components/Avatar.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import Button from "@/components/models/Button";
import RoundDetailCard from "@/components/round/RoundDetailCard.vue";
import { useDisplay } from "vuetify";
import { ProgressQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRoute } from "vue-router";

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
const firstBuilding = ref();
const lastBuilding = ref();

tryOrAlertAsync(async () => {
  data.value = await new ScheduleQuery().getOne(schedule_id);

  for (const progress of await new ProgressQuery().getAll({
    schedule: schedule_id,
  })) {
    progressItems.value.set(progress.building_id, progress);
  }

  if (progressItems.value.size !== data.value?.round.buildings.length) {
    throw new Error("Not every building has a progress item");
  }
});

async function roundUpdated(id: number | undefined) {
  if (id) {
    const progress = await new ProgressQuery().getOne(id);
    progressItems.value.set(progress.building_id, progress);
  }
}
</script>

<style lang="sass">
.space-y
  max-width: 100%
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

.v-timeline-item__body
  padding-inline-start: 12px !important
</style>
