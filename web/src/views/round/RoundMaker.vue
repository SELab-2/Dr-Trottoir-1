<template>
  <div class="grid">
    <MapComponent :buildings="newRoundBuildings" id="map" />
    <div>
      <border-card class="pa-5 mb-5">
        <h2>Ronde</h2>
        <p>De ronde wordt opgeslagen in onderstaande volgorde.</p>
        <v-text-field
          class="mt-3"
          id="roundname"
          label="Naam ronde"
          v-model="newRoundName"
          variant="outlined"
        />
        <v-textarea
          label="Beschrijving"
          v-model="description"
          variant="outlined"
        />
        <v-btn
          id="createround"
          :disabled="
            newRoundName === '' ||
            description === '' ||
            newRoundBuildings.length === 0
          "
          style="width: 100%"
          prepend-icon="mdi-check"
          @click="makeRound()"
          >Ronde aanmaken</v-btn
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
    </div>

    <div>
      <v-text-field
        label="Naam van gebouw"
        bg-color="white"
        prepend-inner-icon="mdi-map-search"
        v-model="searchquery"
        variant="outlined"
      />

      <building-info-card
        v-for="entry in filterlist()"
        :key="entry.listID"
        :name="entry.building.name"
        :address="getFullAddress(entry.building)"
        @clicked="deleteBuildingFromAvailable(entry.listID, entry.building)"
      />
    </div>
  </div>
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
import MapComponent from "@/components/maps/MapComponent.vue";

const availableBuildings: Ref<Array<Result<BuildingQuery>>> = ref([]);

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
const description = ref<string>("");

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
      description: description.value,
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

<style lang="scss">
.grid {
  display: grid;
  gap: 24px;
  padding: 0 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
  }
}

#map {
  grid-column: span 2 / span 2;
}
</style>
