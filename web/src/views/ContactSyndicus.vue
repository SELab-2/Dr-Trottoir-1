<template>
  <v-card variant="flat">
    <v-card variant="flat" class="mx-4">
      <v-row class="py-0 my-0">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <!-- Text input field for the street name -->
          <v-select
            prepend-inner-icon="mdi-account"
            label="Syndicus"
            v-model="syndicus"
            :items="mockdata"
            variant="solo"
          ></v-select>
        </v-col> </v-row
      ><v-row class="py-0 my-0">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <!-- Text input field for the street name -->
          <v-select
            prepend-inner-icon="mdi-office-building"
            label="Gebouw"
            v-model="building"
            variant="solo"
          ></v-select>
        </v-col>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
          <!-- Text input field for the house number -->
          <v-select
            prepend-inner-icon="mdi-list-box"
            label="Sjabloon"
            :items="test"

            variant="solo"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="py-0 my-0">
        <v-text-field variant="solo" label="Onderwerp"> </v-text-field>
      </v-row>
      <v-row class="py-0 my-0"
        ><v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <v-textarea rows="20" label="Uitleg" variant="solo"></v-textarea
        ></v-col>
        <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
          <v-img
            src="../assets/images/defaultImage.png"
            cover
            height="96%"
          ></v-img
        ></v-col>
      </v-row>
      <v-card-actions class="d-flex">
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-send" color="primary">Versturen</v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script lang="ts" setup>
import Template from "@/components/models/Template";
import { ref, Ref, reactive } from "vue";

const syndicus: Ref<String> = ref("");
const building: Ref<String> = ref("");

const templates: Template[] = reactive([
  { name: "Andere", subject: "", content: "" },
  { name: "Opmerking", subject: `Opmerking: ${building}`, content: "" },
  { name: "Klacht", subject: `Klacht: ${building}`, content: "" },
  { name: "Schade", subject: `Schade: ${building}`, content: "" },
]);

const test : any[] = [{name: 'oe', id: 3}, {name: 'merel', id: 4}]

const template = ref<Template>(templates[0]);

const mockdata = [
  {
    syndicus: "Bert Kappellen",
    buildings: ["Upkot zwijnaarde", "Home Astrid", "Home Benedictijntjes"],
  },
  {
    syndicus: "Tijbe Habils",
    buildings: ["Home sterre", "Upkot Zuid"],
  },
];
</script>
