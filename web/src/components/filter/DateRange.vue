

<template>
  <v-btn
    :ripple="false"
    variant="flat"
    class="text-none"
    border="border"
  >
    <input
      type="date"
      :value="getDateString(startDate)"
      @input="$emit('update:startDate', new Date($event.target.value))"
    />
    -
    <input
      type="date"
      :value="getDateString(endDate)"
      @input="$emit('update:endDate', new Date($event.target.value))"
    />
  </v-btn>
</template>
<script setup lang="ts">

const props = defineProps({
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
})

defineEmits(['update:startDate', 'update:endDate'])

function getDateString(date: Date): string{
  //https://stackoverflow.com/questions/12409299/how-to-get-current-formatted-date-dd-mm-yyyy-in-javascript-and-append-it-to-an-i
  const yyyy = date.getFullYear();
  let mm: string = (date.getMonth() + 1).toString(); // Months start at 0!
  let dd: string = date.getDate().toString();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return  yyyy + '-' + mm + '-' + dd;
}

</script>
