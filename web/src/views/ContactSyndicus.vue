<template>
  <v-card variant="flat" class="mx-4">
    <v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <v-select
          label="Syndicus"
          v-model="syndicus_data"
          :items="mock_syndici_data"
          item-value="syndicus"
          item-title="syndicus"
          return-object
          prepend-inner-icon="mdi-account"
          variant="solo"
        >
        </v-select>
      </v-col> </v-row
    ><v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <v-select
          label="Gebouw"
          v-model="building"
          :items="syndicus_data?.buildings"
          return-object
          prepend-inner-icon="mdi-office-building"
          variant="solo"
        >
        </v-select>
      </v-col>
      <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
        <v-select
          label="Sjabloon"
          v-model="selected_template"
          :items="templates"
          item-value="name"
          item-title="name"
          return-object
          prepend-inner-icon="mdi-list-box"
          variant="solo"
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row class="py-0 my-0">
      <v-text-field
        prepend-inner-icon="mdi-text-short"
        variant="solo"
        label="Onderwerp"
        :model-value="selected_template.subject"
      >
      </v-text-field>
    </v-row>
    <v-row class="py-0 my-0"
      ><v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <v-textarea
          prepend-inner-icon="mdi-text-long"
          rows="20"
          label="Uitleg"
          variant="solo"
          :model-value="selected_template.content"
        ></v-textarea
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
</template>

<script lang="ts" setup>
import Template from "@/components/models/Template";
import { ref, computed, reactive } from "vue";

// TODO: remove when implementing the API
interface SyndicusData {
  syndicus: string;
  buildings: string[];
}

//TODO this would be given to the component with props
const mock_data = "De deur in de berging is kapot.";

const syndicus_data = ref<SyndicusData | null>(null);
const building = ref<String>("");

const templates: Template[] = reactive([
  { name: "Andere", subject: "", content: "" },
  {
    name: "Opmerking",
    subject: computed(() => `Opmerking: ${building.value}`),
    content: computed(
      () =>
        `Beste ${syndicus_data.value?.syndicus},\n\nWe hebben het volgende opgemerkt in uw gebouw(${building.value}):\n\t${mock_data}\nDit is ook te zien op foto in bijlage.\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
  {
    name: "Klacht",
    subject: computed(() => `Klacht: ${building.value}`),
    content: computed(
      () =>
        `Beste ${syndicus_data.value?.syndicus},\n\nWe hebben het volgende opgemerkt in uw gebouw(${building.value}):\n\t${mock_data}\nDit is ook te zien op foto in bijlage.\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
  {
    name: "Schade",
    subject: computed(() => `Schade: ${building.value}`),
    content: computed(
      () =>
        `Beste ${syndicus_data.value?.syndicus},\n\nWe hebben het volgende opgemerkt in uw gebouw(${building.value}):\n\t${mock_data}\nDit is ook te zien op foto in bijlage.\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
]);

const selected_template = ref<Template>(templates[0]);

const mock_syndici_data = [
  {
    syndicus: "Bert Kappellen",
    buildings: ["Upkot Zwijnaarde", "Home Astrid", "Home Benedictijntjes"],
  },
  {
    syndicus: "Tijbe Habils",
    buildings: ["Home sterre", "Upkot Zuid"],
  },
];
</script>
