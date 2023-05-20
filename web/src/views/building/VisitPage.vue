<template>
  <HFillWrapper v-if="building !== null">
    <v-card variant="text" class="space-y">
      <img
        alt="banner"
        id="banner"
        src="https://unsplash.com/photos/95YCW2X5jUc/download?force=true&w=1920"
      />

      <div>
        <div class="flex-container">
          <div>
            <h1 class="building-name">{{ building.name }}</h1>
            <p>
              {{ getBuildingDescription() }}
            </p>
          </div>

          <div style="display: flex; flex-wrap: wrap">
            <v-chip variant="outlined" color="border" class="mr-2 labels">
              <v-icon icon="mdi-identifier" color="black" />
              <p class="text-black">{{ building.ivago_id }}</p>
            </v-chip>
            <v-chip variant="outlined" color="border" class="labels">
              <v-icon icon="mdi-map-marker" color="black" />
              <p class="text-black">
                {{ building.address.street }} {{ building.address.number }},
                {{ building.address.zip_code }}, {{ building.address.city }}
              </p>
            </v-chip>
            <!-- TODO: add btn to link to building edit page once we have building edit page -->
          </div>
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
            <div class="d-flex align-center w-100">
              <h4 class="ml-2 me-auto">{{ action.action.description }}</h4>
              <v-chip color="border" variant="outlined">
                <v-icon icon="mdi-calendar-clock"></v-icon>
                <p class="text-black mx-1">
                  {{ new Date(action.pickup_time).toLocaleString("nl") }}
                </p>
              </v-chip>
            </div>
          </CardLayout>
        </div>
        <div v-if="garbage.length === 0">
          <p>Geen taken voor de geselecteerde periode.</p>
        </div>
      </div>
    </v-card>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import Avatar from "@/components/Avatar.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import CardLayout from "@/layouts/CardLayout.vue";
import { BuildingQuery, Result } from "@selab-2/groep-1-query";
import { Ref, ref } from "vue";
import { tryOrAlertAsync } from "@/try";
import { GarbageQuery } from "@selab-2/groep-1-query";
import DateRange from "@/components/filter/DateRange.vue";
import { daysFromDate } from "@/assets/scripts/date";
import SyndicusButtons from "@/components/building/SyndicusButtons.vue";

const takenStart: Ref<Date> = ref(daysFromDate(0));
const takenEnd: Ref<Date> = ref(daysFromDate(6));

const building: Ref<Result<BuildingQuery> | null> = ref(null);
const garbage: Ref<Array<Result<GarbageQuery>>> = ref([]);

function getBuildingDescription(): string {
  const castedBuilding: any = building.value as any;
  return castedBuilding.description;
}

function mail() {
  location.href = "mailto:" + building.value?.syndicus.user.email;
}

function call(number: string | undefined) {
  if (number) {
    location.href = "tel:" + number;
  }
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

async function getTasks() {
  takenStart.value.setHours(0, 0, 0, 0);
  takenEnd.value.setHours(23, 59, 59, 999);
  await getNoneStudentTasks();
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
