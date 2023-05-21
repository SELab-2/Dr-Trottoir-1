<template>
  <HFillWrapper>
    <div class="space-y-8">
      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h1>{{ round?.name }}</h1>
        <div class="flex-grow-1"></div>
        <SimpleButton
          prepend-icon="mdi-delete"
          @click="showRemovePopup = true"
          color="error"
        >
          Verwijderen
        </SimpleButton>
      </div>
      <p>{{ round?.description }}</p>

      <h2 v-show="round?.description">Gebouwen</h2>
      <MapComponent :buildings="buildings" />
      <div class="grid">
        <RoundBuildingCard
          class="inner"
          v-for="building in buildings"
          :key="building.id"
          :building="building"
        ></RoundBuildingCard>
      </div>
      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Planning</h2>
        <div class="flex-grow-1"></div>
        <DateRange
          v-model:start-date="planningStart"
          v-model:end-date="planningEnd"
        />
        <SimpleButton
          prepend-icon="mdi-calendar"
          :to="{ name: 'round_plan', params: { id: round_id } }"
          color="primary"
        >
          Inplannen
        </SimpleButton>
      </div>
      <p v-show="passedSchedules.length === 0">
        Er zijn geen planningen voor de geselecteerde periode.
      </p>
      <div class="space-y-8">
        <RoundCard
          v-for="schedule in schedules"
          v-bind:key="schedule.id"
          :schedule="schedule"
          :status="schedule === schedules[0] ? 'active' : 'scheduled'"
          :comments="false"
          :images="0"
        ></RoundCard>
      </div>

      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Recent</h2>
        <div class="flex-grow-1"></div>
        <DateRange
          v-model:start-date="geschiedenisStart"
          v-model:end-date="geschiedenisEnd"
        />
      </div>
      <p v-show="passedSchedules.length === 0">
        Er zijn geen planningen voor de geselecteerde periode.
      </p>

      <div class="space-y-8">
        <RoundCard
          :schedule="schedule"
          :status="'completed'"
          v-for="schedule in passedSchedules"
          v-bind:key="schedule.id"
          :comments="false"
          :images="0"
        />
      </div>
    </div>
  </HFillWrapper>
  <CardPopup v-model="showRemovePopup">
    <div class="pa-4" style="max-width: 400px">
      <div class="d-flex align-center" style="gap: 12px">
        <v-icon icon="mdi-content-save-alert-outline" size="large"></v-icon>
        <h2>Ronde verwijderen</h2>
      </div>
      <p style="opacity: 90%" class="pt-2 pb-4">
        Je staat op het punt deze ronde te verwijderen. Ben je zeker dat je wilt
        verder gaan?
      </p>
      <div
        style="
          display: grid;
          gap: 12px;
          min-width: fit-content;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        "
      >
        <v-btn
          prepend-icon="mdi-close"
          color="error"
          @click="showRemovePopup = false"
          variant="elevated"
          class="text-none"
        >
          Annuleer
        </v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          @click="deleteRound()"
          variant="elevated"
          class="text-none"
        >
          Bevestig
        </v-btn>
      </div>
    </div>
  </CardPopup>
</template>

<script setup lang="ts">
import {
  BuildingQuery,
  Result,
  RoundQuery,
  ScheduleQuery,
} from "@selab-2/groep-1-query";
import { ref, Ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import RoundCard from "@/components/round/RoundCard.vue";
import RoundBuildingCard from "@/components/cards/RoundBuildingCard.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import DateRange from "@/components/filter/DateRange.vue";
import MapComponent from "@/components/maps/MapComponent.vue";
import CardPopup from "@/components/popups/CardPopup.vue";
import { daysFromDate } from "@/assets/scripts/date";
import SimpleButton from "@/components/buttons/SimpleButton.vue";

/**
 * Get a date days from a given date
 * @param days Amount of dates from the given date
 * @param date Given date, defaults to moment of the function call
 */

const showRemovePopup = ref(false);

const planningStart: Ref<Date> = ref(new Date());
const planningEnd: Ref<Date> = ref(daysFromDate(6));

const geschiedenisEnd: Ref<Date> = ref(daysFromDate(-1));
const geschiedenisStart: Ref<Date> = ref(daysFromDate(-7));

const route = useRoute();
const round_id: number = Number(route.params.id);

const buildings: Ref<Array<Result<BuildingQuery>>> = ref([]);
const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);
const passedSchedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);
const round = ref<Result<RoundQuery>>();

tryOrAlertAsync(async () => {
  round.value = await new RoundQuery().getOne(round_id);
  // get the buildings
  // eslint-disable-next-line no-unsafe-optional-chaining
  for (const round_building of round.value?.buildings) {
    const building = await new BuildingQuery().getOne(
      round_building.building.id,
    );
    buildings.value.push(building);
  }
});

tryOrAlertAsync(async () => {
  planningStart.value.setHours(0, 0, 0, 0);
  planningEnd.value.setHours(23, 59, 59, 999);

  // fetch future schedules
  schedules.value = await new ScheduleQuery().getAll({
    round_id: round_id,
    after: planningStart.value,
    before: planningEnd.value,
  });
});

tryOrAlertAsync(async () => {
  geschiedenisStart.value.setHours(0, 0, 0, 0);
  geschiedenisEnd.value.setHours(23, 59, 59, 999);

  // fetch past schedules
  passedSchedules.value = await new ScheduleQuery().getAll({
    round_id: round_id,
    after: geschiedenisStart.value,
    before: geschiedenisEnd.value,
  });
});

function deleteRound() {
  tryOrAlertAsync(async () => {
    await new RoundQuery().deleteOne({ id: round_id, name: round.value?.name });
    await router.push({ name: "round_overview" });
  });
}
</script>

<style scoped lang="sass">
.map
  grid-column: span 2 / span 2
  object-fit: cover
  width: 100%
  aspect-ratio: 3
  border-radius: 5px

.grid
  display: grid
  gap: 8px
  grid-template-columns: repeat(2, minmax(0, 1fr))

  @media (max-width: 600px)
    display: flex
    flex-direction: column

.inner:last-child:nth-child(odd)
  grid-column: 1 / span 2


.space-y-8
  & > *
    margin-bottom: 8px

.building-list
  width: 100%
  aspect-ratio: 1
  overflow: scroll

.schedule-card
  & > *
    margin-bottom: 8px

  padding: 16px

  img
    width: 200px
    aspect-ratio: 1
    object-fit: cover
    border-radius: 5px

  .carousel
    display: flex
    gap: 24px
    overflow: scroll

  ul
    list-style: inside
</style>
