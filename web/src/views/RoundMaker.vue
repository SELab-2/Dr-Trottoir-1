<template>
  <v-row no-gutters>
    <!-- Usage of v-col to get 2 columns -->
    <!-- This v-col is the content on left hand side of the screen -->
    <v-col class="pa-2 ma-2">
      <v-card width="100%">
        <!-- Header for the card title -->
        <!-- TODO: remove the mockdata from this part -->
        <v-card-title class="d-flex"
          ><v-text-field
            label="Naam ronde"
            hint="Bv: Copure vrijdag"
            variant="solo"
          ></v-text-field
          ><v-spacer></v-spacer><v-btn>Klaar</v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-list width="100%">
            <v-list-item
              v-for="(building, i) in round"
              :key="i"
              :value="building"
              fluid
            >
              <v-list-item-title>{{ building.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ building.adress }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-right align-self-start"
                >Vuilnistype</v-list-item-subtitle
              >

              <!-- Buttons for manipulating the round list -->
              <template v-slot:prepend>
                <v-icon
                  icon="mdi-chevron-up"
                  @click="moveBuildingUp(i)"
                ></v-icon>
                <v-icon
                  icon="mdi-chevron-down"
                  @click="moveBuildingDown(i)"
                ></v-icon>
                <v-icon
                  icon="mdi-close"
                  @click="deleteBuildingFromRound(i, building)"
                ></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-layout>
      </v-card>
    </v-col>
    <!-- Right hand side of the screen -->
    <v-col class="pa-2 ma-2">
      <v-card width="100%">
        <v-card-title>
          <v-text-field
            label="Zoeken op naam van bestaande gebouwen"
            variant="solo"
            v-model="searchquery"
          ></v-text-field>
        </v-card-title>
        <v-divider></v-divider>
        <v-layout>
          <v-list width="100%">
            <v-list-item
              v-for="building in filterlist()"
              :key="building.listid"
              :value="building"
              fluid
            >
              <v-list-item-title>{{ building.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ building.adress }}</v-list-item-subtitle>
              <template v-slot:prepend>
                <!-- Button for manipulating the building list -->
                <v-icon
                  icon="mdi-arrow-left-bold"
                  @click="
                    deleteBuildingFromAvailable(building.listid, building)
                  "
                ></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-layout>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, ref, Ref } from "vue";

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

// This function will give back the buildings which match the string given by the user
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
