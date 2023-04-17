<template>
  <div v-if="data !== null">
    <HFillWrapper
    >
      <div class="space-y">
        <div style="margin-left: 70px; display: flex; align-items: center; gap: 12px">
          <h2>{{data.round.name}}</h2>
          <div class="flex-grow-1"></div>
          <RoundedButton icon="mdi-calendar" :value="new Date(data.day).toLocaleDateString()"></RoundedButton>
          <RoundedButton icon="mdi-account" :value="data.user.first_name + ' ' + data. user.last_name"></RoundedButton>
        </div>

        <p style="margin-left: 70px;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <divider-layout class="my-8" style="margin-left: 70px;"></divider-layout>

        <v-timeline
          truncate-line="both"
          side="end"
          density="compact"
        >
          <v-timeline-item
            :dot-color="'success'"
            :icon="'mdi-check'"
          >
            <h3>Start: 12u00</h3>
          </v-timeline-item>


          <v-timeline-item
            v-for="entry in data.round.buildings.map(e => { return { building: e.building, progress: progressItems.get(e.building_id)}})" v-bind:key="entry.building.id"
            :dot-color="'success'"
            :icon="'mdi-check'"
            :size="'large'"
          >
            <CardLayout class="pa-8 pb-0 space-y">
              <div style="align-items: center; display: flex; cursor: pointer; gap: 12px" @click="router.push({ name: 'building_id', params: { id: entry.building.id } })">
                <div>
                  <h2>{{entry.building.name}}</h2>
                  <p>{{entry.building.address.street}} {{entry.building.address.number}}</p>
                  <p>{{entry.building.address.zip_code}} {{entry.building.address.city}} </p>
                </div>
                <div class="flex-grow-1"></div>

                <RoundedButton v-if="entry.progress" icon="mdi-clock-start" :value="new Date(entry.progress.arrival).toLocaleTimeString()"></RoundedButton>
                <RoundedButton v-if="entry.progress" icon="mdi-clock-end" :value="new Date(entry.progress.departure).toLocaleTimeString()"></RoundedButton>

                <v-icon icon="mdi-chevron-right"></v-icon>
              </div>

              <divider-layout v-if="entry.progress?.report"></divider-layout>

              <div v-if="entry.progress?.report">
                <div style="display: flex; align-items: center">
                  <h3 class="mb-2">Notities</h3>
                  <div class="flex-grow-1"></div>
                </div>
                <p>{{entry.progress.report}}</p>
                <RoundedButton icon="mdi-pencil" value="Bewerken" class="mt-4"></RoundedButton>
              </div>

              <divider-layout></divider-layout>

              <div>
                <h3 class="mb-2">Afbeeldingen</h3>
                <div class="carousel" v-if="entry.progress?.images.length ?? 0 > 0">
                  <div class="carousel-item" v-for="image in entry.progress.images">
                    <img src="https://unsplash.com/photos/u_khkgVDmxA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFzZW1lbnR8ZW58MHx8fHwxNjgxNzA5NzIx&force=true&w=640" >
                    <p style="font-weight: 700; font-size: 14px;" class="mt-2">{{image.type}}</p>
                    <p style="opacity: 90%">{{image.description}}</p>
                  </div>
                </div>
                <p v-else style="opacity: 75%">Geen foto's toegevoegd.</p>
                <RoundedButton icon="mdi-plus" value="Toevoegen" class="mt-4"></RoundedButton>
              </div>
            </CardLayout>
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
import {Ref, ref} from "vue";
import DividerLayout from "@/layouts/DividerLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import {ProgressQuery, Result, ScheduleQuery} from "@selab-2/groep-1-query";
import {tryOrAlertAsync} from "@/try";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import router from "@/router";

const data: Ref<Result<ScheduleQuery> | null> = ref(null);
const progressItems: Ref<Map<Number, Result<ProgressQuery>>> = ref(new Map());

tryOrAlertAsync(async () => {
  data.value = await new ScheduleQuery().getOne(35);
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

.carousel
  img
    width: 100%
    aspect-ratio: 1
    border-radius: 5px
    overflow: clip
    object-fit: cover

  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 24px
</style>
