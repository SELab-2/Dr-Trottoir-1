<template>
  <CardLayout
    v-if="schedule"
    id="buildingcard"
    class="building-card"
    @click="
      router.push({
        name: 'round_detail',
        params: { id: schedule.round_id, schedule: schedule.id },
      })
    "
  >
    <div>
      <h3>{{ new Date(schedule?.day).toLocaleDateString() }}</h3>
      <p>{{ schedule.user.first_name }} {{ schedule?.user.last_name }}</p>
    </div>
    <div class="flex-grow-1"></div>
    <!-- Amount of images taken indicator -->
    <RoundedInfoChip
      v-show="getImagesAmount(progress) !== 0"
      icon="mdi-image-outline"
      :text="getImagesAmount(progress).toString()"
    />
    <!-- Amount of comments made indicator -->
    <RoundedInfoChip
      v-show="getCommentsAmount(progress) !== 0"
      icon="mdi-comment-outline"
      :text="getCommentsAmount(progress).toString()"
    />

    <!-- Active round indication -->
    <v-chip
      color="yellow-darken-3"
      variant="outlined"
      v-show="
        roundStarted(progress) &&
        getCompletedBuildings(progress) !== progress.length
      "
    >
      <v-icon icon="mdi-bicycle-cargo" class="mr-1" />
      Actief
    </v-chip>

    <!-- Done round indication -->
    <v-chip
      color="success"
      variant="outlined"
      v-show="getCompletedBuildings(progress) === progress.length"
    >
      <v-icon icon="mdi-check" class="mr-1" />
      Klaar
    </v-chip>
    <v-icon
      icon="mdi-chevron-right"
      @click="
        router.push({
          name: 'round_detail',
          params: { id: schedule.round_id, schedule: schedule.id },
        })
      "
    ></v-icon>
  </CardLayout>
</template>

<script lang="ts" setup>
import router from "@/router";
import CardLayout from "@/layouts/CardLayout.vue";
import { ProgressQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { ref, Ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import {
  getCommentsAmount,
  getCompletedBuildings,
  getImagesAmount,
  roundStarted,
} from "@/assets/scripts/roundProgress";
import RoundedInfoChip from "@/components/chips/RoundedInfoChip.vue";

const props = defineProps<{
  schedule: Result<ScheduleQuery>;
}>();

const progress: Ref<Array<Result<ProgressQuery>>> = ref([]);

tryOrAlertAsync(async () => {
  progress.value = await new ProgressQuery().getAll({
    schedule: props.schedule.id,
  });
});
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
