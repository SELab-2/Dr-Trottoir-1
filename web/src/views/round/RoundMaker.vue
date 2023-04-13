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
        <v-text-field class="ml-3 mr-5" label="Naam ronde" variant="solo" />
        <v-card-actions class="d-flex align-center"
          ><v-spacer></v-spacer
          ><v-btn class="ml-3" prepend-icon="mdi-check"
            >Ronde aanmaken</v-btn
          ></v-card-actions
        >
      </border-card>
      <building-select-card
        v-for="(building, i) in round"
        @remove="deleteBuildingFromRound(i, building)"
        @up="moveBuildingUp(i)"
        @down="moveBuildingDown(i)"
        :name="building.name"
        :address="building.adress"
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
          variant="solo"
        />
      </border-card>

      <building-info-card
        v-for="building in filterlist()"
        :key="building.listid"
        :name="building.name"
        :address="building.adress"
        @clicked="deleteBuildingFromAvailable(building.listid, building)"
      >
      </building-info-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, ref, Ref } from "vue";
import BorderCard from "@/layouts/CardLayout.vue";
import BuildingSelectCard from "@/components/cards/BuildingSelectCard.vue";
import BuildingInfoCard from "@/components/cards/BuildingInfoCard.vue";

const garbageinfo: Ref<boolean> = ref(true);

// The query that will be used to filter all available buildings
const searchquery: Ref<string> = ref("");

/*
 * TODO: Building should be populated via a api/backend call
 * For now it's just mockdata
 * Reactive so the lists on screen update in real time
 */
const buildings: { name: string; adress: string }[] = reactive([
  { adress: "10841 Sutter CircleSutter Creek95685", name: "Lee" },
  { adress: "915 Sacramento StreetBakersfield93305", name: "Lartigue" },
  { adress: "1383 Purdue StreetSan Leandro94579", name: "Anderson" },
  { adress: "553 South Arlington RoadOrange92869", name: "Campbell" },
  { adress: "450 C StreetHayward94541", name: "Kahn" },
  { adress: "915 Sacramento StreetBakersfield93305", name: "Amezaga" },
  { adress: "800 California 116Sebastopol95472", name: "Petersen" },
  { adress: "7725 Ney AvenueOakland94605", name: "Hof" },
  { adress: "3777 Mowry AvenueFremont94538", name: "Johnson" },
  { adress: "1011 San Jose StreetSan Leandro94577", name: "Rodriguez" },
]);

/*
 * Round is the list that will be populated by the user
 * Should always start as an empty list
 */
const round: { name: string; adress: string }[] = reactive([]);

/**
 * TODO: This function will give back the buildings which match the string given by the user
 * Change this with an autocomplete but currently doesnt work with objects from mockdata
 * Pagination is something that could be introduced in the API aswell?
 */
function filterlist(): { name: string; adress: string; listid: number }[] {
  let filteredlist: { name: string; adress: string; listid: number }[] = [];
  buildings.forEach((building, index) => {
    if (building.name.toLowerCase().includes(searchquery.value.toLowerCase())) {
      filteredlist.push({
        name: building.name,
        adress: building.adress,
        listid: index,
      });
    }
  });
  return filteredlist;
}

/*
 * Next 2 functions handle switching buildings from one list to another
 * This one handles switching one from round to all the buildings
 */
function deleteBuildingFromAvailable(
  index: number,
  building: { adress: string; name: string },
) {
  buildings.splice(index, 1);
  round.push(building);
}

/*
 * Switches a building from all available buildings to round
 */
function deleteBuildingFromRound(
  index: number,
  building: { adress: string; name: string },
) {
  round.splice(index, 1);
  buildings.push(building);
}

/*
 * Next 2 functions handle switching buildings within the roundlist
 * Move a building up in the list
 */
function moveBuildingUp(index: number) {
  if (index > 0) {
    let temp = round[index];
    round[index] = round[index - 1];
    round[index - 1] = temp;
  }
}

/*
 * Move a building down in the list
 */
function moveBuildingDown(index: number) {
  if (round.length - 1 > index) {
    let temp = round[index];
    round[index] = round[index + 1];
    round[index + 1] = temp;
  }
}
</script>
