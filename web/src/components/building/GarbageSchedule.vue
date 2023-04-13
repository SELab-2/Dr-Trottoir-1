<template>
  <div id="container">
    <h2>Kalender</h2>

    <div class="grid">
      <VDatePicker id="calendar" expanded show-weeknumbers v-model="date" mode="date" :attributes='attrs' />

      <div class="list">
        <div class="garbage-card" v-for="visit in schedule" v-bind:key="visit.id">
          <div class="flex">
            <Avatar :name="visit.user.first_name + ' ' + visit.user.last_name" />
            <div>
              <p class="student-name">{{ visit.user.first_name + " " + visit.user.last_name }}</p>
            </div>
          </div>
        </div>

        <div v-for="item in garbage" v-bind:key="item.id" flat class="garbage-card">
          <div class="spread-out">
            <p class="garbage-type">{{ item.action.description }}</p>
            <p class="garbage-time">{{ new Date(item.pickup_time).toLocaleTimeString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import 'v-calendar/style.css';
import { computed, Ref, ref } from "vue";
import { GarbageQuery } from "@selab-2/groep-1-query/dist/garbage";
import { ScheduleQuery } from "@selab-2/groep-1-query";
import { Garbage, Schedule } from "@selab-2/groep-1-orm";
import Avatar from "@/components/Avatar.vue";

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

const garbage: Ref<Garbage[] | null> = ref(null);
const schedule: Ref<Schedule[] | null> = ref(null);
const date = ref(new Date());

new GarbageQuery().getAll({}).then(result => {
  garbage.value = result;
  attrs.value[0].dates = result.map(e => e.pickup_time);
});

const res = await new ScheduleQuery().getAll({
}).then(result => {
  schedule.value = result;
  attrs.value[1].dates = result.map(e => e.day);
});


const val = computed( () => {
  new ScheduleQuery().getAll({}).then(result => {
    schedule.value = result;
    attrs.value[1].dates = result.map(e => e.day);
  });
});
</script>

<style scoped lang="sass">
#container
  &>*
    margin-top: 16px

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
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 16px

.list
  grid-column: span 2 / span 2
  display: flex
  flex-direction: column
  gap: 16px
  padding-left: 16px // TODO: idk why this is required, but it is
  overflow-y: scroll
  height: 300px

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
