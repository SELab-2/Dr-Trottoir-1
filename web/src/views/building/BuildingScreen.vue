<template>
  <HFillWrapper v-if="building !== null">
    <div class="space-y">
      <img
        alt="banner"
        id="banner"
        src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
      />

      <div>
        <div class="d-flex justify-space-between">
          <h1 class="building-name">{{ building.name }}</h1>
          <RoundedButton
            v-if="!useAuthStore().auth?.student"
            @clicked="() => router.push({ name: 'building_new' })"
            icon="mdi-pencil"
            class="mt-2"
          />
        </div>

        <!-- TODO add in API
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p> -->

        <div style="display: flex; gap: 16px; flex-wrap: wrap" class="mt-2">
          <RoundedButton
            icon="mdi-map-search"
            @click="tomaps()"
            value="Kaarten"
          />
          <RoundedButton
            icon="mdi-file-pdf-box"
            @click="toClip('TODO')"
            value="Handleiding"
          />
          <!-- TODO add in API
          <RoundedButton icon="mdi-lock" @click="toClip('TODO')" value="TODO" /> -->
        </div>
      </div>

      <CardLayout
        style="
          display: flex;
          gap: 16px;
          align-items: center;
          border-radius: 10px;
          padding: 16px 0 16px 16px;
        "
      >
        <Avatar
          :name="
            building.syndicus?.user.first_name +
            ' ' +
            building.syndicus?.user.last_name
          "
        ></Avatar>

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

        <div style="flex-grow: 1"></div>

        <div style="gap: 16px; flex-wrap: wrap" class="d-flex flex-row-reverse">
          <RoundedButton
            icon="mdi-phone"
            @click="call(building.syndicus?.user.phone)"
            :value="building.syndicus?.user.phone"
          />
          <RoundedButton
            icon="mdi-mail"
            value="E-mail"
            @click="mail(building.syndicus?.user.email)"
          />
        </div>
      </CardLayout>

      <div class="space-y-8">
        <div class="d-flex mt-8 flex-wrap align-center">
          <h2 class="me-auto">Taken</h2>
          <div class="d-flex flex-wrap">
            <div class="chip mx-1 mt-1">
              <input type="date" v-model="taskStartDate" @change='getTasks()'/>
              tot
              <input type="date" v-model="taskEndDate" @change='getTasks()'/>
            </div>
            <RoundedButton
              icon="mdi-plus"
              class="mx-1 mt-1"
              value="Toevoegen"
              @click="
                () => router.push({ name: 'garbage_plan', params: { id: id } })
              "
            />
          </div>
        </div>
        <div class="grid">
          <CardLayout
            style="
              display: flex;
              align-items: center;
              padding: 16px 0 16px 16px;
              gap: 16px;
            "
            v-for="action in garbage"
            :key="action.id"
          >
            <div>
              <h4>{{ action.action.description }}</h4>
              <p>{{ new Date(action.pickup_time).toLocaleString() }}</p>
            </div>
            <div class="flex-grow-1"></div>
            <v-icon icon="mdi-check" v-if="Math.random() < 0.5"></v-icon>
            <v-icon v-else icon="mdi-plus"></v-icon>
            <v-icon icon="mdi-trash-can-outline"></v-icon>
          </CardLayout>
        </div>
        <div v-if='garbage.length === 0'>
          <p>Geen taken voor de geselecteerde periode.</p>
        </div>
      </div>

      <div class="space-y-8" v-if='useAuthStore().auth?.admin || useAuthStore().auth?.super_student'>
        <div class="d-flex mt-8 flex-wrap align-center">
          <h2 class="me-auto">Bezoeken</h2>
          <div class="d-flex">
            <div class="chip mx-1 mt-1">
              <input type="month" v-model="scheduleMonth" @change='getVisits()' />
            </div>
            <RoundedButton
              class="mx-1 mt-1"
              icon="mdi-plus"
              value="Toevoegen"
            ></RoundedButton>
          </div>
        </div>
        <div v-for='progress in progresses' :key="progress.id">
          <RoundCard
            :schedule="progress.schedule"
            :status="progress.arrival? progress.departure? 'completed' : 'active' : 'scheduled'"
            :comments="progress.report != null && progress.report !== ''"
            :images="progress.images.length"
          />
        </div>
        <div v-if='progresses.length === 0'>
          <p>Geen bezoeken voor de geselecteerde periode.</p>
        </div>
      </div>
    </div>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import RoundedButton from "@/components/buttons/RoundedButton.vue";
import router from "@/router";
import Avatar from "@/components/Avatar.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import { BuildingQuery, ProgressQuery, Result } from '@selab-2/groep-1-query'
import { Ref, ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import RoundCard from "@/components/round/RoundCard.vue";
import { GarbageQuery } from "@selab-2/groep-1-query/dist/garbage";
import { useAuthStore } from "@/stores/auth";

const building: Ref<Result<BuildingQuery> | null> = ref(null);
const progresses: Ref<Array<Result<ProgressQuery>>> = ref([]);
const garbage: Ref<Array<Result<GarbageQuery>>> = ref([]);

const scheduleMonth: Ref<string> = ref(
  `${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1)).slice(
    -2,
  )}`,
);

const taskStartDate: Ref<string> = ref(new Date().toISOString().split("T")[0]);
const taskEndDate: Ref<string> = ref(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]);

function call(number: string) {
  location.href = "tel:" + number;
}

function mail(address: string) {
  location.href = "mailto:" + address;
}

function tomaps() {
  window.open(
    `https://maps.google.com/maps?q=${building.value?.address.number}+${building.value?.address.street},+${building.value?.address.city},+${building.value?.address.zip_code}`,
  );
}

function toClip(text: string) {
  navigator.clipboard.writeText(text);
}

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
  const startOfMonth = new Date(scheduleMonth.value + '-01');
  const endOfMonth = new Date(new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).setHours(23,59,59,999));
  await tryOrAlertAsync(async () => {
    if (building.value) {
      progresses.value = [];
      for (const progress: Result<ProgressQuery> of await new ProgressQuery().getAll({
        building: building.value.id,
      })) {
        const progressDay = new Date(progress.schedule?.day)
        if(progressDay > startOfMonth && progressDay < endOfMonth) {
          progresses.value.push(progress);
        }
      }
    }
  });
}
await getVisits();

async function getTasks() {
  await tryOrAlertAsync(async () => {
    if (building.value) {
      garbage.value = await new GarbageQuery().getAll({
        building_id: building.value.id,
        before: new Date(taskStartDate.value),
        after: new Date(taskStartDate.value),
        syndicus_id: building.value.syndicus.id
      });
    }
  });
}
await getTasks();
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

  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
</style>
