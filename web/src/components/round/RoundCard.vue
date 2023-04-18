<template>
  <CardLayout
    class="building-card"
    @click="router.push({ name: 'round_detail', params: { id: schedule.round_id, schedule: schedule.id } })"
  >
    <div>
      <h3>{{new Date(schedule.day).toLocaleDateString()}}</h3>
      <p>{{schedule.user.first_name}} {{schedule.user.last_name}}</p>
    </div>
    <div class="flex-grow-1"></div>
    <RoundedButton class="bg-green-lighten-5" v-if="status == 'active'" icon="mdi-bicycle-cargo" value="Actief"></RoundedButton>
    <RoundedButton v-if="status != 'scheduled' && Math.random() < 0.75" icon="mdi-note-edit-outline" value="Opmerkingen"></RoundedButton>
    <RoundedButton v-if="status != 'scheduled'" icon="mdi-image" value="10"></RoundedButton>
    <v-icon v-if="status != 'scheduled'" icon="mdi-chevron-right"></v-icon>
    <v-icon v-else icon="mdi-trash-can-outline"></v-icon>
  </CardLayout>
</template>

<script lang="ts" setup>
import router from "@/router";
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import { Result, ScheduleQuery } from "@selab-2/groep-1-query";

const props = defineProps<{
  schedule: Result<ScheduleQuery>,
  status: "completed" | "active" | "scheduled",
}>();
</script>

<style lang="sass">
.space-y-8
  & > *
    margin-bottom: 8px

.building-card
  padding: 16px 0 16px 16px
  display: flex
  align-items: center
  gap: 16px

</style>
