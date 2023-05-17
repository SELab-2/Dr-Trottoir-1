<template>
  <div>
    <HFillWrapper margin="mx-4 mb-4">
      <BorderCard class="mb-2"
        ><v-tabs
          v-model="showAllPlanned"
          align-tabs="center"
          @update:model-value="updateFullScheme()"
        >
          <v-spacer></v-spacer>
          <v-tab :value="false">Afval inplannen</v-tab>
          <v-spacer></v-spacer>
          <v-tab :value="true">Voorlopig schema</v-tab>
          <v-spacer></v-spacer> </v-tabs
      ></BorderCard>
      <BorderCard
        class="pa-8"
        style="display: flex; flex-direction: column; gap: 12px"
        ><v-expand-transition
          ><div v-show="!showAllPlanned">
            <div class="d-flex">
              <h2>Afvalkalender voor:</h2>
              <v-hover v-slot:default="{ isHovering, props }">
                <h2
                  class="mx-1"
                  v-bind="props"
                  @click="
                    router.push({
                      name: 'building_id',
                      params: { id: currentBuilding?.id },
                    })
                  "
                  :class="isHovering ? 'text-decoration-underline' : ''"
                >
                  {{ currentBuilding?.name }}
                </h2>
              </v-hover>
            </div>

            <p class="mb-4">
              Kies hier een actie die moet uitgevoerd worden voor
              {{ currentBuilding?.name }}. Kies een frequentie en datum(s)
              wanneer deze actie ingepland zou moeten worden. Druk op tijdelijk
              toevoegen om een voorbeeld te zien van hoe deze inplanning er zal
              uitzien. Hiervoor kunt u ook gebruik maken van "voorlopig schema".
              Als u tevreden bent met deze inplanning, kan u deze opslaan door
              op "Inplannen" te drukken. Bent u ontevreden en wilt u opnieuw
              beginnen, druk dan op "Alles verwijderen".
            </p>

            <v-row class="pt-2">
              <v-col
                cols="1"
                style="min-width: 100px; max-width: 100%"
                class="flex-grow-1 flex-shrink-0"
              >
                <v-select
                  v-model="action"
                  :items="actions"
                  item-value="description"
                  item-title="description"
                  return-object
                  label="Actie"
                ></v-select
              ></v-col>
              <v-col
                cols="1"
                style="min-width: 100px; max-width: 100%"
                class="flex-grow-1 flex-shrink-0"
              >
                <v-select
                  v-model="frequency"
                  :items="frequenties"
                  label="Frequentie"
                ></v-select></v-col
            ></v-row>

            <div
              class="selectors"
              :class="frequency !== 'enkel' ? 'grid-cols-3' : 'grid-cols-2'"
            >
              <v-text-field
                v-model="startDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                type="date"
                label="Startdatum"
              ></v-text-field>

              <v-text-field
                v-model="endDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                type="date"
                label="Einddatum"
                v-if="frequency != 'enkel'"
              ></v-text-field>

              <v-text-field
                prepend-inner-icon="mdi-clock-time-two-outline"
                label="Starttijd"
                variant="outlined"
                type="time"
                v-model="time"
              ></v-text-field>
            </div>

            <div class="d-flex">
              <v-btn prepend-icon="mdi-delete" variant="tonal" @click="clearAll"
                >Alles verwijderen</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-plus-circle"
                @click="add"
                variant="tonal"
                :disabled="action === undefined"
                >Tijdelijk toevoegen</v-btn
              ><v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-check"
                variant="tonal"
                @click="submit"
                :disabled="detailedDays.length === 0"
                >Inplannen</v-btn
              >
            </div>
          </div></v-expand-transition
        >
        <v-expand-transition
          ><div v-show="showAllPlanned">
            <div class="d-flex">
              <h2>Voorlopig overzicht:</h2>
              <v-hover v-slot:default="{ isHovering, props }">
                <h2
                  class="mx-1"
                  v-bind="props"
                  @click="
                    router.push({
                      name: 'building_id',
                      params: { id: currentBuilding?.id },
                    })
                  "
                  :class="isHovering ? 'text-decoration-underline' : ''"
                >
                  {{ currentBuilding?.name }}
                </h2>
              </v-hover>
            </div>
            <p>
              Hier wordt er een voorlopige planning getoond de afvalkalender
              voor {{ currentBuilding?.name }}. Kies start- en einddatum door
              deze aan te passen in de velden. Tussen dit overzicht staat er ook
              afval dat nog niet bevestigd is. Ga hier na of de inplanning en
              het type afval op die dag wel of niet werkt. Om te bevestigen, ga
              terug naar afval inplannen.
            </p>
            <div class="d-flex mt-4">
              <v-text-field
                class="mr-1"
                v-model="fullSchemeStartDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                type="date"
                label="Startdatum"
              ></v-text-field>
              <v-text-field
                class="ml-1"
                v-model="fullSchemeEndDate"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                type="date"
                label="Einddatum"
              ></v-text-field>
            </div>
            <div class="d-flex">
              <v-spacer></v-spacer>
              <v-btn
                prepend-icon="mdi-check"
                @click="updateFullScheme()"
                variant="tonal"
                >Pas filter toe</v-btn
              >
            </div>
          </div></v-expand-transition
        >
      </BorderCard>

      <Table
        v-if="!showAllPlanned"
        v-bind:entries="detailedDays"
        v-bind:headers="GarbageTable.headers()"
        class="mb-5"
      ></Table>
      <Table
        v-else
        v-bind:entries="fullScheme"
        v-bind:headers="GarbageOverviewTable.headers()"
        class="mb-5"
      ></Table>
    </HFillWrapper>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { tryOrAlertAsync } from "@/try";
import BorderCard from "@/layouts/CardLayout.vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import Table from "@/components/table/Table.vue";
import { DetailedDay, GarbageTable } from "@/types/GarbageTable";
import {
  GarbageOverviewEntry,
  GarbageOverviewTable,
} from "@/types/GarbageOverviewTable";
import {
  Result,
  ActionQuery,
  GarbageQuery,
  BuildingQuery,
} from "@selab-2/groep-1-query";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const actions = ref<Result<ActionQuery>[]>([]);
const frequenties = ["enkel", "wekelijks", "tweewekelijks", "maandelijks"];
const fullSchemeStartDate = ref<string>(
  new Date().toISOString().substring(0, 10),
);
const fullSchemeEndDate = ref<string>(oneWeekLater());
const currentBuilding = ref<Result<BuildingQuery>>();
onMounted(() => {
  tryOrAlertAsync(async () => {
    actions.value = await new ActionQuery().getAll();
  });

  tryOrAlertAsync(async () => {
    currentBuilding.value = await new BuildingQuery().getOne(buildingId);
  });
});
function oneWeekLater() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate.toISOString().substring(0, 10);
}

const showAllPlanned = ref<boolean>(false);

const frequencyDict: Record<string, number> = {
  enkel: 1,
  wekelijks: 7,
  tweewekelijks: 14,
  maandelijks: 28,
};

const route = useRoute();
const buildingId: number = Number(route.params.id);
const action = ref<Result<ActionQuery>>();
const startDate = ref<string>(new Date().toISOString().substring(0, 10));
const endDate = ref<string>(new Date().toISOString().substring(0, 10));
const time = ref<string>("12:00");
const frequency = ref<string>("wekelijks");
const detailedDays = ref<Array<DetailedDay | null>>([]);

function add() {
  if (frequency.value === "enkel") {
    endDate.value = startDate.value;
  }

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  let frequencyCount = frequencyDict[frequency.value];

  for (const d = start; d <= end; d.setDate(d.getDate() + frequencyCount)) {
    detailedDays.value.push({
      date: new Date(d),
      action: action.value!,
      time: time.value,
    });
  }
}

function formatDate(d: Date | undefined): string {
  if (d) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }
  return "";
}

async function submit() {
  for (let garbageDetail of detailedDays.value) {
    await tryOrAlertAsync(async () => {
      const dtDate = new Date(
        formatDate(garbageDetail?.date) + " " + garbageDetail?.time + ":00",
      );
      await new GarbageQuery().createOne({
        action_id: action.value?.id,
        building_id: buildingId,
        pickup_time: dtDate,
      });
    });
  }
  clearAll();
}

const fullScheme = ref<GarbageOverviewEntry[]>([]);

function updateFullScheme() {
  tryOrAlertAsync(async () => {
    fullScheme.value.splice(0);
    const scheduledGarbage: Result<GarbageQuery>[] =
      await new GarbageQuery().getAll({
        building_id: buildingId,
        after: new Date(fullSchemeStartDate.value),
        before: new Date(fullSchemeEndDate.value),
      });

    for (const garbage of scheduledGarbage) {
      fullScheme.value.push({
        action: garbage.action,
        date: new Date(garbage.pickup_time),
        time: new Date(garbage.pickup_time).toTimeString().substring(0, 5),
        preview: false,
      });
    }

    for (const garbage of detailedDays.value) {
      if (
        garbage &&
        new Date(fullSchemeStartDate.value).getTime() <=
          garbage.date.getTime() &&
        garbage.date.getTime() <= new Date(fullSchemeEndDate.value).getTime()
      ) {
        fullScheme.value.push({
          action: garbage?.action,
          date: new Date(garbage.date),
          time: garbage.time,
          preview: true,
        });
      }
    }
    fullScheme.value.sort(
      (a: GarbageOverviewEntry, b: GarbageOverviewEntry) => {
        return a.date.getTime() - b.date.getTime();
      },
    );
  });
}

function clearAll() {
  while (detailedDays.value.length > 0) {
    detailedDays.value.pop();
  }
}
</script>

<style lang="sass">
.flex
  display: flex
  gap: 20px

.grid-cols-2
  grid-template-columns: repeat(2, minmax(0, 1fr))

.grid-cols-3
  grid-template-columns: repeat(3, minmax(0, 1fr))

.selectors
  display: grid
  flex-direction: row
  gap: 12px
  height: 80px

  & > *
    min-height: 100%
</style>
