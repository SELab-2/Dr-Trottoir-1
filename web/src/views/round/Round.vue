<template>
  <HFillWrapper>
    <div class="space-y-8">
      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h1>{{ round?.name }}</h1>
        <div class="flex-grow-1"></div>
        <v-btn
          class="text-none"
          prepend-icon="mdi-delete"
          @click="deleteRound()"
          color="error"
        >
          Verwijderen
        </v-btn>
      </div>

      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Gebouwen</h2>
        <div class="flex-grow-1"></div>
        <RoundedButton icon="mdi-calendar" value="Wijzigen"></RoundedButton>
      </div>

      <div class="grid">
        <img src="@/assets/images/dummyMap.png" class="map" alt="Map" />
        <BuildingCard
          v-for="building in buildings"
          :key="building.id"
          :building="building"
        ></BuildingCard>
      </div>
      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Planning</h2>
        <div class="flex-grow-1"></div>
        <DateRange
          v-model:start-date="planningStart"
          v-model:end-date="planningEnd"
        />
        <v-btn
          class="text-none"
          prepend-icon="mdi-calendar"
          :to="{ name: 'round_plan', params: { id: round_id } }"
          color="primary"
        >
          Inplannen
        </v-btn>
      </div>

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

      <div class="space-y-8">
        <RoundCard
          :schedule="schedule"
          :status="'completed'"
          v-for="schedule in schedules"
          v-bind:key="schedule.id"
          :comments="false"
          :images="0"
        />
      </div>
    </div>
  </HFillWrapper>
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
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import RoundCard from "@/components/round/RoundCard.vue";
import BuildingCard from "@/components/building/BuildingCard.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import DateRange from "@/components/filter/DateRange.vue";

const planningStart = ref(new Date());
const planningEnd = ref(new Date());

const geschiedenisStart = ref(new Date());
const geschiedenisEnd = ref(new Date());

const route = useRoute();
const round_id: number = Number(route.params.id);

const buildings: Ref<Array<Result<BuildingQuery>>> = ref([]);
const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);
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
  schedules.value = await new ScheduleQuery().getAll({ take: 5 });
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
