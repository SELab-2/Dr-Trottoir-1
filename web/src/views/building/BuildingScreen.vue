<template>
  <HFillWrapper v-if="building !== null">
    <v-card variant="text" class="space-y">
      <img
        alt="banner"
        id="banner"
        src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
      />
      <RemovedCard
        :show="useAuthStore().auth?.admin && building.deleted"
        title="Dit gebouw is verwijderd."
        :restore="
          async () => {
            await restoreBuilding();
          }
        "
      ></RemovedCard>

      <div>
        <div class="flex-container">
          <div>
            <h1 class="building-name">{{ building.name }}</h1>
            <p>
              {{ getBuildingDescription() }}
            </p>
          </div>

          <div style="display: flex; flex-wrap: wrap">
            <RoundedInfoChip
              class="mr-2 labels"
              icon="mdi-identifier"
              :text="building.ivago_id"
            />
            <RoundedInfoChip
              class="labels"
              icon="mdi-map-marker"
              :text="
                building.address.street +
                building.address.number +
                building.address.zip_code +
                building.address.city
              "
            />
            <!-- TODO: add btn to link to building edit page once we have building edit page -->
          </div>
        </div>

        <div class="d-flex mt-2" style="gap: 16px; flex-wrap: wrap">
          <div class="me-auto d-flex" style="gap: 16px; flex-wrap: wrap">
            <SimpleButton
              prepend-icon="mdi-map-search"
              @click="tomaps()"
              color="primary"
            >
              Kaarten
            </SimpleButton>
            <SimpleButton
              append-icon="mdi-download"
              prepend-icon="mdi-file-pdf-box"
              :href="'http://10.0.0.5:8080/file/' + building.manual?.id"
              color="success"
            >
              Handleiding
            </SimpleButton>
          </div>

          <SimpleButton
            v-show="useAuthStore().auth?.admin && !building.deleted"
            prepend-icon="mdi-delete"
            @click="showRemovePopup = true"
            color="error"
          >
            Verwijder
          </SimpleButton>

          <!-- TODO add in API
          <RoundedButton icon="mdi-lock" @click="toClip('TODO')" value="TODO" /> -->
        </div>
      </div>

      <CardLayout class="grid pt-3 pb-1 px-3" style="align-items: center">
        <div>
          <div style="gap: 16px; flex-wrap: wrap" class="d-flex flex-row">
            <Avatar
              :name="
                building.syndicus?.user.first_name +
                ' ' +
                building.syndicus?.user.last_name
              "
            />
            <div>
              <p style="font-weight: 600; font-size: 16px; opacity: 90%">
                SYNDICUS
              </p>
              <p style="font-weight: 500">
                {{
                  building.syndicus?.user.first_name +
                  " " +
                  building.syndicus?.user.last_name
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid-right">
          <SyndicusButtons
            :email="building.syndicus.user.email"
            :click-email="mail"
            :phone="building.syndicus.user.phone"
            :click-phone="call"
          />
        </div>
      </CardLayout>

      <div class="space-y-8">
        <div class="d-flex mt-8 flex-wrap align-center">
          <h2 class="me-auto">Taken</h2>
          <div class="d-flex flex-wrap">
            <DateRange
              v-model:end-date="takenEnd"
              v-model:start-date="takenStart"
              @update:end-date="getTasks()"
              @update:start-date="getTasks()"
            />
            <SimpleButton
              v-show="noStudent && !building.deleted"
              class="mx-1 text-none"
              prepend-icon="mdi-plus"
              :to="{ name: 'garbage_plan', params: { id: id } }"
              color="primary"
            >
              Toevoegen
            </SimpleButton>
          </div>
        </div>
        <div class="grid">
          <CardLayout
            class="inner"
            style="
              display: flex;
              align-items: center;
              padding: 16px 0 16px 16px;
              gap: 16px;
            "
            v-for="action in garbage"
            :key="action.id"
          >
            <div class="d-flex align-center w-100">
              <h4 class="ml-2 me-auto">{{ action.action.description }}</h4>
              <RoundedInfoChip
                icon="mdi-calendar-clock"
                :text="new Date(action.pickup_time).toLocaleString('nl')"
              />
            </div>
          </CardLayout>
        </div>
        <div v-if="garbage.length === 0">
          <p>Geen taken voor de geselecteerde periode.</p>
        </div>
      </div>

      <div v-show="noStudent">
        <div class="space-y-8" v-if="noStudent">
          <div class="d-flex mt-8 flex-wrap align-center">
            <h2 class="me-auto">Bezoeken</h2>
            <div class="d-flex">
              <DateRange
                v-model:end-date="bezoekenEnd"
                v-model:start-date="bezoekenStart"
                @update:end-date="getVisits()"
                @update:start-date="getVisits()"
              />
            </div>
          </div>
          <div v-for="schedule in schedules" :key="schedule.id">
            <RoundCard :schedule="schedule" />
          </div>
          <div v-if="schedules.length === 0">
            <p>Geen bezoeken voor de geselecteerde periode.</p>
          </div>
        </div>
      </div>
    </v-card>
  </HFillWrapper>
  <CardPopup
    v-model="showRemovePopup"
    :width="312"
    title="Verwijder Ronde"
    prepend-icon="mdi-delete"
  >
    <p class="ma-3">
      Je staat op het punt dit gebouw te verwijderen. Ben je zeker dat je wilt
      verder gaan?
    </p>
    <template v-slot:actions>
      <SimpleButton
        prepend-icon="mdi-close"
        color="error"
        variant="elevated"
        @click="showRemovePopup = false"
        >Annuleren</SimpleButton
      >
      <SimpleButton
        prepend-icon="mdi-check"
        color="success"
        variant="elevated"
        @click="deleteBuilding()"
        >Verwijder gebouw</SimpleButton
      >
    </template>
  </CardPopup>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import {
  BuildingQuery,
  ProgressQuery,
  Result,
  ScheduleQuery,
} from "@selab-2/groep-1-query";
import { Ref, ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import RoundCard from "@/components/round/RoundCard.vue";
import { GarbageQuery } from "@selab-2/groep-1-query";
import { useAuthStore } from "@/stores/auth";
import DateRange from "@/components/filter/DateRange.vue";
import { daysFromDate } from "@/assets/scripts/date";
import SyndicusButtons from "@/components/building/SyndicusButtons.vue";
import CardPopup from "@/components/popups/CardPopup.vue";

import SimpleButton from "@/components/buttons/SimpleButton.vue";
import RoundedInfoChip from "@/components/chips/RoundedInfoChip.vue";

import RemovedCard from "@/components/cards/RemovedCard.vue";
import router from "@/router";

const showRemovePopup = ref(false);

const noStudent: Boolean =
  useAuthStore().auth!.admin || useAuthStore().auth!.super_student;

const bezoekenStart: Ref<Date> = ref(daysFromDate(-14));
const bezoekenEnd: Ref<Date> = ref(daysFromDate(13));

const takenStart: Ref<Date> = ref(daysFromDate(0));
const takenEnd: Ref<Date> = noStudent
  ? ref(daysFromDate(6))
  : ref(daysFromDate(0));

const building: Ref<Result<BuildingQuery> | null> = ref(null);
const garbage: Ref<Array<Result<GarbageQuery>>> = ref([]);
const schedules: Ref<Array<Result<ScheduleQuery>>> = ref([]);

function getBuildingDescription(): string {
  const castedBuilding: any = building.value as any;
  return castedBuilding.description;
}

function mail() {
  router.push({ name: "contact_syndicus", params: { id: building.value?.id } });
}

function call(number: string | undefined) {
  if (number) {
    location.href = "tel:" + number;
  }
}

function tomaps() {
  window.open(
    `https://maps.google.com/maps?q=${building.value?.address.number}+${building.value?.address.street},+${building.value?.address.city},+${building.value?.address.zip_code}`,
  );
}

/*
function toClip(text: string) {
  navigator.clipboard.writeText(text);
}*/

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

await tryOrAlertAsync(async () => {
  building.value = await new BuildingQuery().getOne(Number(props.id));
});

async function getVisits() {
  // clear current schedules
  schedules.value = [];
  bezoekenStart.value.setHours(0, 0, 0, 0);
  bezoekenEnd.value.setHours(23, 59, 59, 999);
  // fetch all schedules
  await tryOrAlertAsync(async () => {
    if (!building.value) {
      return;
    }
    const progresses = await new ProgressQuery().getAll({
      building: building.value?.id,
    });
    for (const progress of progresses) {
      if (progress.schedule) {
        const progressDay = new Date(progress.schedule.day);
        if (
          progressDay > bezoekenStart.value &&
          progressDay < bezoekenEnd.value &&
          progress.schedule_id
        ) {
          const schedule = await new ScheduleQuery().getOne(
            progress.schedule_id,
          );
          schedules.value.push(schedule);
        }
      }
    }
  });
}
if (useAuthStore().auth?.admin || useAuthStore().auth?.super_student) {
  await getVisits();
}

async function getTasks() {
  takenStart.value.setHours(0, 0, 0, 0);
  takenEnd.value.setHours(23, 59, 59, 999);
  if (noStudent) {
    await getNoneStudentTasks();
  } else {
    await getStudentTasks();
  }
}
await getTasks();

async function getNoneStudentTasks() {
  await tryOrAlertAsync(async () => {
    if (building.value) {
      garbage.value = await new GarbageQuery().getAll({
        building_id: building.value.id,
        before: takenEnd.value,
        after: takenStart.value,
        syndicus_id: building.value.syndicus.id,
      });
    }
  });
}

async function getStudentTasks() {
  await tryOrAlertAsync(async () => {
    // get all rounds in the date range for student
    const rounds = await new ScheduleQuery().getAll({
      before: takenEnd.value,
      after: takenStart.value,
      user_id: useAuthStore().auth!.id,
    });
    garbage.value = [];
    // filter for the rounds with this building, and get the garbage
    for (const round of rounds) {
      for (const building of round.round.buildings) {
        if (building.id === Number(props.id)) {
          // the round has this building, so we can get the garbage
          const garbages = await new GarbageQuery().getAll({
            before: takenEnd.value,
            after: takenStart.value,
            building_id: building.id,
            round_id: round.round_id,
          });
          // add all the garbage for this building,
          // for this day, for the round of the user
          for (const gar of garbages) {
            garbage.value.push(gar);
          }
        }
      }
    }
  });
}

async function deleteBuilding() {
  await tryOrAlertAsync(async () => {
    await new BuildingQuery().deleteOne({ id: building.value?.id });
  });
  router.go(0);
}

async function restoreBuilding() {
  await new BuildingQuery().updateOne({
    id: building.value?.id,
    deleted: false,
  });
  router.go(0);
}
</script>

<style lang="scss" scoped>
#banner {
  width: 100%;
  max-height: 34vh;
  object-fit: cover;
  border-radius: 5px;
}

.space-y {
  & > * {
    margin-bottom: 32px;
  }
}

.space-y-8 {
  & > * {
    margin-bottom: 8px;
  }
}

#building-screen {
  max-width: 800px;
  margin: auto;

  & > * {
    margin: 50px 0;
  }
}

.grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
  }
}

.inner:last-child:nth-child(odd) {
  grid-column: 1 / span 2;
}

.grid-right {
  margin-left: 0;
  margin-right: auto;
  @media (min-width: 700px) {
    margin-left: auto;
    margin-right: 0;
  }
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 50px;
  background: #ffffff;
  font-family: Roboto, sans-serif !important;
  font-size: 14px;
  font-weight: bold;
  border: 1.5px solid #e0e0e0;
  width: fit-content;
  height: fit-content;
  color: #000000de;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.labels {
  @media (max-width: 700px) {
    margin-bottom: 5px;
  }
}
</style>
