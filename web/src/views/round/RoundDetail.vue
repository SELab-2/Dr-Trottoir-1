<template>
  <div v-if="data !== null">
    <HFillWrapper >
      <div class="space-y">
        <div style="display: flex; align-items: center; gap: 12px">
          <h2>Ronde Korenmarkt</h2>
          <div class="flex-grow-1"></div>
          <RoundedButton icon="mdi-calendar" :value="new Date().toLocaleDateString()"></RoundedButton>
          <RoundedButton icon="mdi-account" :value="data.user.first_name + ' ' + data. user.last_name"></RoundedButton>
        </div>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <divider-layout class="my-8"></divider-layout>

        <v-timeline
          truncate-line="both"
          side="end"
          density="compact"
          style="margin-left: -70px"
        >
          <v-timeline-item
            :dot-color="'success'"
            :icon="'mdi-check'"
          >
            <h3>Start: 12u00</h3>
          </v-timeline-item>


          <v-timeline-item
            v-for="building in data.round.buildings.map(e => e.building)" v-bind:data="building.id"
            :dot-color="'success'"
            :icon="'mdi-check'"
            :size="'large'"
            style="width: 100%"
          >

            <CardLayout class="pa-4 pb-0 space-y">
              <div style="align-items: center; display: flex; ">
                <div>
                  <h3>{{building.name}}</h3>
                  <p>{{building.address.street}} {{building.address.number}}</p>
                  <p>{{building.address.zip_code}} {{building.address.city}} </p>
                </div>
                <div class="flex-grow-1"></div>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </div>

              <divider-layout></divider-layout>

              <div>
                <h4 class="mb-2">Notities</h4>
                <ul style="list-style: inside" v-for="i in [0, 1, 2]" v-bind:key="i">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                </ul>
              </div>

              <divider-layout></divider-layout>

              <div>
                <h4 class="mb-2">Afbeeldingen</h4>
                <div class="carousel">
                  <img src="https://unsplash.com/photos/u_khkgVDmxA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFzZW1lbnR8ZW58MHx8fHwxNjgxNzA5NzIx&force=true&w=640">
                </div>
              </div>
            </CardLayout>
          </v-timeline-item>

          <v-timeline-item
            :tag="'TEST'"
            :dot-color="'grey'"
            :icon="'mdi-clock'"
          >
            <h3>Einde</h3>
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
import {Result, ScheduleQuery} from "@selab-2/groep-1-query";
import {tryOrAlertAsync} from "@/try";
import RoundedButton from "@/components/buttons/RoundedButton.vue";

const data: Ref<Result<ScheduleQuery> | null> = ref(null);

tryOrAlertAsync(async () => {
  data.value = (await new ScheduleQuery().getAll({take: 1})).at(0) ?? null;
})
</script>

<style lang="sass">
.space-y
  & > *
    margin-bottom: 12px

.carousel
  img
    height: 200px
    aspect-ratio: 1
    border-radius: 5px
    overflow: clip
</style>
