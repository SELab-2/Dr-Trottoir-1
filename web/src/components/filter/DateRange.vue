<template>
  <v-btn :ripple="false" variant="flat" class="text-none" border="border">
    <input type="date" v-model="startValue" :max="endValue" />
    -
    <input type="date" v-model="endValue" :min="startValue" />
  </v-btn>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const emit = defineEmits(["update:startDate", "update:endDate"]);

const startValue = computed({
  get() {
    return getDateString(props.startDate);
  },
  set(startValue) {
    emit("update:startDate", new Date(startValue));
  },
});

const endValue = computed({
  get() {
    return getDateString(props.endDate);
  },
  set(endValue) {
    emit("update:endDate", new Date(endValue));
  },
});

function getDateString(date: Date | undefined): string {
  if (date === undefined) {
    return "";
  }
  //https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();
  let day = dd < 10 ? "0" + dd : dd.toString();
  let month = mm < 10 ? "0" + mm : mm.toString();

  return yyyy + "-" + month + "-" + day;
}
</script>
