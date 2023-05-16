<template>
  <div v-if="data !== null">
    <HFillWrapper>
      <div class="space-y">
        <div style="margin-bottom: 0; display: flex; gap: 12px">
          <h2 v-if='useAuthStore().auth?.student'>{{ data.round.name }}</h2>
          <v-hover v-else v-slot:default='{isHovering, props}'>
            <h2
              v-bind='props'
              @click='router.push({name: "round", params: { id: data.round.id}})'
              :class='isHovering? "text-decoration-underline": ""'
            >
              {{ data.round.name }}
            </h2>
          </v-hover>
          <div class="flex-grow-1"></div>
          <CardLayout
            class="pa-1 d-flex align-center"
            style="border-radius: 30px"
            :to="{ name: 'account_settings', params: { id: data.user.id } }"
          >
            <Avatar
              size="small"
              :name="`${data.user.first_name} ${data.user.last_name}`"
            />
            <p class="ml-1" v-if="!mobile">
              {{ data.user.first_name }} {{ data.user.last_name }}
            </p>
          </CardLayout>
        </div>
        <p>
          <v-icon icon="mdi-calendar" />
          {{ new Date(data.day).toLocaleDateString("nl") }}
        </p>

        <!-- TODO add description (not in api)
        <p>
        </p>

        <divider-layout class="my-8"></divider-layout>-->

        <v-timeline
          truncate-line="both"
          side="end"
          density="compact"
          align="start"
        >
          <v-timeline-item
            v-if="getFirstBuilding()?.arrival"
            dot-color="success"
            icon="mdi-check"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">
              Start:
              {{
                new Date(getFirstBuilding().arrival).toLocaleTimeString("nl", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </h3>
          </v-timeline-item>
          <v-timeline-item
            v-else
            dot-color="grey"
            icon="mdi-clock"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">Ronde nog niet begonnen.</h3>
          </v-timeline-item>

          <v-timeline-item
            v-for="entry in data.round.buildings.map((e) => {
              return {
                building: e.building,
                progress: progressItems.get(e.building_id),
              };
            })"
            v-bind:key="entry.building.id"
            :dot-color="entry.progress?.departure ? 'success' : 'grey'"
            :icon="entry.progress?.departure ? 'mdi-check' : 'mdi-clock'"
            size="large"
            width="100%"
          >
            <RoundDetailCard
              :class="mobile ? 'shiftUnderTimeLine' : ''"
              :key="JSON.stringify(entry.progress)"
              :entry="entry"
              :day='data.day'
              @changed="progressUpdated(entry.progress?.id)"
              @requestPhotoAdd="
                (progress) => {
                  currentProgress = progress;
                  showOverlay = true;
                  overlayIsPhoto = true;
                }
              "
            />
          </v-timeline-item>

          <v-timeline-item
            v-if="
              getLastBuilding()?.departure
            "
            dot-color="success"
            icon="mdi-check"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">
              Einde:
              {{
                new Date(getLastBuilding().departure).toLocaleTimeString("nl", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </h3>
          </v-timeline-item>
          <v-timeline-item
            v-else
            dot-color="grey"
            icon="mdi-clock"
            size="large"
            width="100%"
          >
            <h3 class="pt-2">Ronde nog niet beëindigd.</h3>
          </v-timeline-item>
        </v-timeline>
      </div>
    </HFillWrapper>
  </div>
  <AddButton
    :key="currentProgress?.id + ':' + currentProgress?.arrival"
    icon="mdi-plus"
    :items="currentProgress?.arrival ? actions : startActions"
    :title="currentProgress?.building.name"
    v-if="mobile && currentProgress && canEdit()"
  />
  <v-overlay
    v-model="showOverlay"
    class="align-center justify-center"
  >
    <PhotoMaker
      @cancel="showOverlay = false"
      @confirm="updateProgressWithPhoto"
      :is-photo="overlayIsPhoto"
      :current-comments="currentProgress?.report"
    />
  </v-overlay>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import Avatar from "@/components/Avatar.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import Button from "@/components/models/Button";
import RoundDetailCard from "@/components/round/RoundDetailCard.vue";
import PhotoMaker from "@/components/images/PhotoMaker.vue";
import { useDisplay } from "vuetify";
import { ProgressQuery, Result, ScheduleQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRoute, useRouter } from 'vue-router'
import Photo from "@/components/models/Photo";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const actions: Button[] = [
  {
    title: "Foto toevoegen",
    clicked: () => {
      showOverlay.value = true;
      overlayIsPhoto.value = true;
    },
  },
  {
    title: "Opmerking toevoegen",
    clicked: () => {
      showOverlay.value = true;
      overlayIsPhoto.value = false;
    },
  },
  {
    title: "Bezoek beëindigen",
    clicked: async () => {
      if (currentProgress.value) {
        await tryOrAlertAsync(async () => {
          if (currentProgress.value) {
            currentProgress.value = await new ProgressQuery().updateOne({
              id: currentProgress.value.id,
              departure: new Date(),
            });
          }
        });
        await progressUpdated(currentProgress.value.id);
      }
    },
  },
];

const startActions: Button[] = [
  {
    title: "Bezoek starten",
    clicked: async () => {
      if (currentProgress.value) {
        await tryOrAlertAsync(async () => {
          if (currentProgress.value) {
            currentProgress.value = await new ProgressQuery().updateOne({
              id: currentProgress.value.id,
              arrival: new Date(),
            });
          }
        });
        await progressUpdated(currentProgress.value.id);
      }
    },
  },
];

const isStudent = useAuthStore().auth?.student;
function canEdit() {
  if (!data.value){
    return false;
  }
  return isStudent && (new Date(new Date(data.value.day).setHours(0, 0, 0)) >= new Date());
}

const showOverlay = ref(false);
const overlayIsPhoto = ref(true);

const route = useRoute();
const schedule_id: number = Number(route.params.schedule);

const data: Ref<Result<ScheduleQuery> | null> = ref(null);
const progressItems: Ref<Map<Number, Result<ProgressQuery>>> = ref(new Map());
const currentProgress: Ref<Result<ProgressQuery> | null> = ref(null);

const display = useDisplay();
const mobile = display.mobile;

await tryOrAlertAsync(async () => {
  data.value = await new ScheduleQuery().getOne(schedule_id);
  for (const progress of await new ProgressQuery().getAll({
    schedule: schedule_id,
    user: data.value.user.id,
  })) {
    progressItems.value.set(progress.building_id, progress);
  }
  if (progressItems.value.size !== data.value?.round.buildings.length) {
    throw new Error("Not every building has a progress item");
  }

  setCurrentProgress();
});

function getFirstBuilding() {
  if(data.value) {
    let firstBuilding = progressItems.value.get(data.value.round.buildings[0].building_id);
    for (const building of data.value.round.buildings) {
      const build = progressItems.value.get(building.building_id);
      if (build?.arrival && (!firstBuilding?.arrival || new Date(build.arrival) < new Date(firstBuilding.arrival))) {
        firstBuilding = build;
      }
    }
    return firstBuilding;
  }
  return null;
}

function getLastBuilding() {
  if(data.value) {
    let lastbuilding = progressItems.value.get(data.value.round.buildings[0].building_id);
    for (const building of data.value.round.buildings) {
      const build = progressItems.value.get(building.building_id);
      if (!build?.departure) {
        return build;
      }
      if (build && (!lastbuilding?.departure || new Date(build.departure) > new Date(lastbuilding.departure))) {
        lastbuilding = build;
      }
    }
    return lastbuilding;
  }
  return null;
}

function setCurrentProgress() {
  if (data.value?.round.buildings) {
    for (const building of data.value.round.buildings) {
      const progress = progressItems.value.get(building.building_id);
      if (progress && progress.departure == null) {
        currentProgress.value = progress;
        return;
      }
    }
    currentProgress.value = null;
  }
}

async function progressUpdated(id: number | undefined) {
  if (id) {
    const progress = await new ProgressQuery().getOne(id);
    progressItems.value.set(progress.building_id, progress);
    setCurrentProgress();
  }
}

async function updateProgressWithPhoto(photo: Photo, isPhoto: boolean) {
  if (isPhoto) {
    //TODO add photo with file query builder
    await tryOrAlertAsync(async () => {
      if (currentProgress.value) {
        currentProgress.value = await new ProgressQuery().createImage(
          currentProgress.value.id,
          {
            location: "EXTERNAL",
            description: photo.comments,
            path: photo.image.toString(),
            time: new Date(),
            type: photo.type,
            user_id: useAuthStore().auth?.id ?? -1,
          },
        );
      }
    });
  } else {
    await tryOrAlertAsync(async () => {
      if (currentProgress.value) {
        currentProgress.value = await new ProgressQuery().updateOne({
          id: currentProgress.value.id,
          report: photo.comments,
        });
      }
    });
  }
  await progressUpdated(currentProgress.value?.id);
  showOverlay.value = false;
}
</script>

<style lang="sass">
.space-y
  max-width: 100%
  & > *
    margin-bottom: 24px

.header
  display: flex
  align-items: center
  gap: 12px

  @media (max-width: 700px)
    flex-direction: column

.header-buttons
  display: flex
  align-items: center
  gap: 12px

.v-timeline-item__body
  @media (max-width: 750px)
    padding-inline-start: 2px !important
  padding-inline-start: 12px !important
.shiftUnderTimeLine
  transform: translateX(-26px)
  width: calc(100% + 26px)
</style>
