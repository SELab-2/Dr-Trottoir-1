<template>
  <CardLayout
    v-if="schedule"
    id="buildingcard"
    class="building-card"
    @click="
      router.push({
        name: 'round_detail',
        params: { id: schedule?.round_id, schedule: schedule?.id },
      })
    "
  >
    <div>
      <h3 id="date">{{ new Date(schedule.day).toLocaleDateString() }}</h3>
      <p id="student">{{ schedule.user.first_name }} {{ schedule.user.last_name }}</p>
    </div>
    <div class="flex-grow-1"></div>
    <RoundedButton
      class="bg-green-lighten-5"
      v-if="status === 'active'"
      icon="mdi-bicycle-cargo"
      value="Actief"
    ></RoundedButton>
    <RoundedButton
      v-if="comments"
      icon="mdi-note-edit-outline"
      value="Opmerkingen"
    ></RoundedButton>
    <RoundedButton
      id="images"
      v-if="images > 0"
      icon="mdi-image"
      :value="images.toString()"
    ></RoundedButton>
    <v-icon
      icon="mdi-chevron-right"
      @click="
        router.push({
          name: 'round_detail',
          params: { id: schedule?.round_id, schedule: schedule?.id },
        })
      "
    ></v-icon>
  </CardLayout>
</template>

<script lang="ts" setup>
import router from "@/router";
import CardLayout from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import { Schedule, User } from "@selab-2/groep-1-orm";

defineProps<{
  schedule: (Schedule & { user: User }) | null;
  status: "completed" | "active" | "scheduled";
  comments: boolean;
  images: number;
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
