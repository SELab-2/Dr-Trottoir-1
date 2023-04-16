<template>
  <HFillWrapper>
    <h2>Kalender</h2>

    <VDatePicker class="my-2" id="calendar" expanded v-model="date" mode="date" :attributes='attrs' borderless transparent style="border-radius: 5px; background-color: white;" columns="2"/>

    <div class="my-4 grid">
      <div>
        <h3 class="mb-2">Taken</h3>
        <div class="list">
          <div v-for="item in garbage" v-bind:key="item.id" flat class="garbage-card">
            <div class="spread-out">
              <p class="garbage-type">{{ item.action.description }}</p>
              <p class="garbage-time">{{ new Date(item.pickup_time).toLocaleTimeString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-2">Studentbezoeken</h3>
        <div class="list">
          <div class="garbage-card" v-for="visit in schedule" v-bind:key="visit.id">
            <div class="flex">
              <Avatar :name="visit.user.first_name + ' ' + visit.user.last_name" />
              <div>
                <p style="font-weight: 600; font-size: 12px; opacity: 80%">STUDENT</p>
                <p style="font-weight: 700">{{ visit.user.first_name + " " + visit.user.last_name }}</p>
              </div>
              <div style="flex-grow: 1"></div>
              <Badge value="1"></Badge>
              <p style="opacity: 80%; font-size: 14px; font-weight: 400">Ronde Korenmarkt</p>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import 'v-calendar/style.css';
import { Ref, ref } from "vue";
import { GarbageQuery } from "@selab-2/groep-1-query/dist/garbage";
import { ScheduleQuery } from "@selab-2/groep-1-query";
import { Garbage, Schedule } from "@selab-2/groep-1-orm";
import Avatar from "@/components/Avatar.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import Badge from "@/components/Badge.vue";

type Annotations = {
  dot: boolean | { color: string };
  key: number;
  dates: Array<Date>;
}

const attrs: Ref<Array<Annotations>> = ref([
  {
    dot: {
      color: 'blue',
    },
    key: 0,
    dates: [],
  },
  {
    dot: {
      color: 'red',
    },
    key: 1,
    dates: [],
  },
]);

const garbage: Ref<Garbage[]> = ref([]);
const schedule: Ref<Schedule[]> = ref([]);
const date = ref(new Date());

new GarbageQuery().getAll({}).then(result => {
  garbage.value = result;
  attrs.value[0].dates = result.map(e => e.pickup_time);
});

new ScheduleQuery().getAll({}).then(result => {
  schedule.value = result;
  attrs.value[1].dates = result.map(e => e.day);
});
</script>

<style scoped lang="sass">
.spread-out
  display: flex
  justify-content: space-between
  align-items: center

.flex
  display: flex
  gap: 8px
  align-items: center

.grid
  display: grid
  grid-template-rows: repeat(1, minmax(0, 1fr))
  grid-template-columns: repeat(2, minmax(0, 1fr))
  gap: 16px

.list
  display: flex
  flex-direction: column
  gap: 16px

ul
  list-style-position: inside

.garbage-card
  padding: 12px
  background-color: white
  border-radius: 5px

.garbage-type
  font-weight: 600

.garbage-time
  font-weight: 400
  opacity: 80%

.garbage-category
  font-weight: 600
  text-transform: uppercase
  opacity: 75%
  font-size: 12px

.portrait
  height: 48px
  aspect-ratio: 1
  object-fit: cover
  border-radius: 9999px

.student-name
  font-weight: 600
  font-size: 16px
</style>
