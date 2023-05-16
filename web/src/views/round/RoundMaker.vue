<template>
  <v-row class="py-0 my-2 mx-2">
    <v-col
      cols="1"
      style="min-width: 100px; max-width: 100%"
      class="flex-grow-1 flex-shrink-0 py-0 my-0"
      ><border-card
        class="mb-4"
        title="Ronde aanmaken"
        subtitle="De ronde zal in de volgorde van onderstaande lijst opgeslaan worden"
      >
        <template v-slot:append
          ><v-switch
            color="primary"
            v-model="garbageinfo"
            label="Toon afvalkalender"
          ></v-switch
        ></template>
        <v-text-field
          class="ml-3 mr-5"
          label="Naam ronde"
          v-model="newRoundName"
          variant="outlined"
        />
        <v-card-actions class="d-flex align-center"
          ><v-spacer></v-spacer
          ><v-btn class="ml-3" prepend-icon="mdi-check" @click="makeRound()"
            >Ronde aanmaken</v-btn
          ></v-card-actions
        >
      </border-card>
      <building-select-card
        v-for="(building, i) in newRoundBuildings"
        :key="i"
        @remove="deleteBuildingFromRound(i, building)"
        @up="moveBuildingUp(i)"
        @down="moveBuildingDown(i)"
        :name="building.name"
        :building-id="building.id"
        :address="getFullAddress(building)"
        :garbageinfo="garbageinfo"
      ></building-select-card>
    </v-col>
    <v-col
      cols="2"
      style="min-width: 100px; max-width: 100%"
      class="flex-grow-1 flex-shrink-0 py-0 ml-5"
      ><border-card
        title="Zoeken in gebouwen"
        subtitle="Klik op een gebouw om deze toe te voegen aan de lijst"
        class="mb-4 pt-3"
        ><v-text-field
          class="ml-3 mr-5 mt-3"
          label="Naam van gebouw"
          v-model="searchquery"
          variant="outlined"
        />
      </border-card>

      <building-info-card
        v-for="entry in filterlist()"
        :key="entry.listID"
        :name="entry.building.name"
        :address="getFullAddress(entry.building)"
        @clicked="deleteBuildingFromAvailable(entry.listID, entry.building)"
      >
      </building-info-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from "vue";
import BorderCard from "@/layouts/CardLayout.vue";
import BuildingSelectCard from "@/components/cards/BuildingSelectCard.vue";
import BuildingInfoCard from "@/components/cards/BuildingInfoCard.vue";
import { Result, BuildingQuery, RoundQuery } from "@selab-2/groep-1-query";
import { RoundBuildingQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import router from "@/router";

const availableBuildings = ref<Result<BuildingQuery>[]>([]);

onMounted(() => {
  tryOrAlertAsync(async () => {
    /* TODO implement if selab is bumped
    const allBuildings = await new BuildingQuery().getAll();
    const available : Result<RoundBuildingQuery>[] = []

    for (const building of allBuildings){
      try {
        await new RoundBuildingQuery().getOne(building.id)
      }
      catch {
        available.push(building)
      }
    }
    */
    availableBuildings.value = await new BuildingQuery().getAll();
  });
});

const garbageinfo: Ref<boolean> = ref(true);

const newRoundName = ref<string>("");

// The query that will be used to filter all available buildings
const searchquery: Ref<string> = ref("");

/*
 * Round is the list that will be populated by the user
 * Should always start as an empty list
 */
const newRoundBuildings = ref<Result<BuildingQuery>[]>([]);

type BuildingEntry = {
  building: Result<BuildingQuery>;
  listID: number;
};

/**
 * TODO: This function will give back the buildings which match the string given by the user
 * Change this with an autocomplete but currently doesnt work with objects from mockdata
 * Pagination is something that could be introduced in the API aswell?
 */
function filterlist(): BuildingEntry[] {
  let filteredlist: BuildingEntry[] = [];
  availableBuildings.value.forEach((building, index) => {
    if (building.name.toLowerCase().includes(searchquery.value.toLowerCase())) {
      filteredlist.push({
        building: building,
        listID: index,
      });
    }
  });
  return filteredlist;
}

function getFullAddress(building: Result<BuildingQuery>) {
  const address = building.address;
  return `${address.street} ${address.number}, ${address.city}`;
}

function makeRound() {
  tryOrAlertAsync(async () => {
    const newRound = await new RoundQuery().createOne({
      name: newRoundName.value,
    });

    for (const building of newRoundBuildings.value) {
      await new RoundBuildingQuery().createOne({
        building_id: building.id,
        round_id: newRound.id,
      });
    }

    router.push({ name: "round", params: { id: newRound.id } });
  });
}

/*
 * Next 2 functions handle switching buildings from one list to another
 * This one handles switching one from round to all the buildings
 */
function deleteBuildingFromAvailable(
  index: number,
  building: Result<BuildingQuery>,
) {
  availableBuildings.value.splice(index, 1);
  newRoundBuildings.value.push(building);
}

/*
 * Switches a building from all available buildings to round
 */
function deleteBuildingFromRound(
  index: number,
  building: Result<BuildingQuery>,
) {
  newRoundBuildings.value.splice(index, 1);
  availableBuildings.value.push(building);
}

/*
 * Next 2 functions handle switching buildings within the roundlist
 * Move a building up in the list
 */
function moveBuildingUp(index: number) {
  if (index > 0) {
    let temp = newRoundBuildings.value[index];
    newRoundBuildings.value[index] = newRoundBuildings.value[index - 1];
    newRoundBuildings.value[index - 1] = temp;
  }
}

/*
 * Move a building down in the list
 */
function moveBuildingDown(index: number) {
  if (newRoundBuildings.value.length - 1 > index) {
    let temp = newRoundBuildings.value[index];
    newRoundBuildings.value[index] = newRoundBuildings.value[index + 1];
    newRoundBuildings.value[index + 1] = temp;
  }
}
</script>
