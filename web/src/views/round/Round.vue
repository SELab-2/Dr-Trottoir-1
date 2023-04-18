<template>
  <HFillWrapper>
    <div class="space-y-8">
      <h1>Ronde Korenmarkt</h1>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Gebouwen</h2>
        <div class="flex-grow-1"></div>
        <RoundedButton icon="mdi-calendar" value="Wijzigen"></RoundedButton>
      </div>

      <div class="grid">
        <img src="@/assets/images/dummyMap.png" class="map" alt="Map">

        <CardLayout
          class="building-card"
          v-for="building in buildings"
          v-bind:key="building.id"
          @click="router.push({ name: 'building_id', params: { id: building.id } })"
        >
          <div>
            <h3>{{building.name}}</h3>
            <p>{{building.address.street}} {{building.address.number}}</p>
            <p>{{building.address.zip_code}} {{building.address.city}} </p>
          </div>
          <div class="flex-grow-1"></div>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </CardLayout>
      </div>



      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Planning</h2>
        <div class="flex-grow-1"></div>
        <RoundedButton icon="mdi-calendar" value="Inplannen"></RoundedButton>
      </div>

      <div class="space-y-8">
        <CardLayout
          class="building-card"
          v-for="schedule in schedules"
          v-bind:key="schedule.id"
          @click="router.push({ name: 'round_detail', params: { id: schedule.round_id, schedule: schedule.id } })"
        >
          <div>
            <h3>{{new Date(schedule.day).toLocaleDateString()}}</h3>
            <p>{{schedule.user.first_name}} {{schedule.user.last_name}}</p>
          </div>
          <div class="flex-grow-1"></div>
          <RoundedButton class="bg-green-lighten-5" v-if="schedule === schedules[0]" icon="mdi-bicycle-cargo" value="Actief"></RoundedButton>
          <RoundedButton v-if="schedule === schedules[0]" icon="mdi-image" value="13"></RoundedButton>
          <RoundedButton v-if="schedule === schedules[0]" icon="mdi-note-edit-outline" value="10"></RoundedButton>
          <v-icon v-if="schedule === schedules[0]" icon="mdi-chevron-right"></v-icon>
          <v-icon v-else icon="mdi-delete-outline"></v-icon>
        </CardLayout>
      </div>

      <div style="display: flex; gap: 8px; align-items: center" class="mt-8">
        <h2>Afgelopen bezoeken</h2>
        <div class="flex-grow-1"></div>
        <RoundedButton icon="mdi-history" value="Volledige geschiedenis"></RoundedButton>
      </div>

      <div class="space-y-8">
        <CardLayout
          class="building-card"
          v-for="schedule in schedules"
          v-bind:key="schedule.id"
          @click="router.push({ name: 'round_detail', params: { id: schedule.round_id, schedule: schedule.id } })"
        >
          <div>
            <h3>{{new Date(schedule.day).toLocaleDateString()}}</h3>
            <p>{{schedule.user.first_name}} {{schedule.user.last_name}}</p>
          </div>
          <div class="flex-grow-1"></div>
          <RoundedButton icon="mdi-image" value="13"></RoundedButton>
          <RoundedButton icon="mdi-note-edit-outline" value="10"></RoundedButton>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </CardLayout>
      </div>
    </div>
  </HFillWrapper>
</template>

<script setup lang="ts">
import {BuildingQuery, Result, ScheduleQuery} from "@selab-2/groep-1-query";
import {ref, Ref} from "vue";
import {tryOrAlertAsync} from "@/try";
import CardLayout from "@/layouts/CardLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import router from "@/router";

const buildings: Ref<Array<Result<BuildingQuery>>> = ref([]);
const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);

tryOrAlertAsync(async () => {
  buildings.value = await new BuildingQuery().getAll({take: 5});
});

tryOrAlertAsync(async () => {
  schedules.value = await new ScheduleQuery().getAll({take: 5})
})
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

.space-y-8
  & > *
    margin-bottom: 8px

.building-list
  width: 100%
  aspect-ratio: 1
  overflow: scroll

.building-card
  padding: 24px 0 24px 24px
  display: flex
  align-items: center
  gap: 24px

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
