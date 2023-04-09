<template>
  <HFillWrapper>
    <v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <v-autocomplete
          label="Gebouw"
          :items="mock_buildings"
          v-model="building"
          variant="solo"
          prepend-inner-icon="mdi-office-building"
          ><template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.raw"
              :subtitle="mock_synidcus"
            ></v-list-item> </template
        ></v-autocomplete>
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
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <!-- TODO: this is for mock, should be one function -->
        <v-text-field
          v-if="!building"
          prepend-inner-icon="mdi-account"
          readonly
          label="Syndicus"
          variant="solo"
        ></v-text-field>
        <v-text-field
          v-else
          prepend-inner-icon="mdi-account"
          label="Syndicus"
          v-model="mock_synidcus"
          readonly
          variant="solo"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="py-0 my-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <v-text-field
          prepend-inner-icon="mdi-text-short"
          variant="solo"
          label="Onderwerp"
          :model-value="selected_template.subject"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row class="py-0 my-0"
      ><v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
        ><v-file-input
          prepend-icon=""
          prepend-inner-icon="mdi-upload"
          label="Bestanden"
          variant="solo"
        ></v-file-input></v-col
    ></v-row>
    <v-row class="py-0 my-0"
      ><v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <v-textarea
          prepend-inner-icon="mdi-text-long"
          rows="17"
          label="Uitleg"
          variant="solo"
          :model-value="selected_template.content"
        ></v-textarea
      ></v-col>
    </v-row>
    <v-card-actions class="d-flex">
      <v-spacer></v-spacer>
      <v-btn color="primary" prepend-icon="mdi-send">Versturen</v-btn>
    </v-card-actions>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import Template from "@/components/models/Template";
import { ref, computed, reactive } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";

// API in place
//defineProps({
//  building_id: String,
//  photo_id: String/path?
//})

const mock_synidcus: string = "Syndicus 1";
const mock_buildings = ["Upkot Zuid", "Vooruit", "Shopping Zuid"];
const building = ref<string>("");
const mock_comment: string = "De deur in de berging is kapot.";

const templates: Template[] = reactive([
  { name: "Andere", subject: "", content: "" },
  {
    name: "Opmerking",
    subject: computed(() => `Opmerking: ${building.value}`),
    content: computed(
      () =>
        `Beste ${mock_synidcus},\n\nWe hebben het volgende opgemerkt in uw gebouw(${building.value}):\n\t${mock_comment}\nDit is ook te zien op foto in bijlage.\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
  {
    name: "Klacht",
    subject: computed(() => `Klacht: ${building.value}`),
    content: computed(
      () =>
        `Beste ${mock_synidcus},\n\nWe hebben het volgende opgemerkt in uw gebouw(${building.value}):\n\t${mock_comment}\nDit is ook te zien op foto in bijlage.\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
  {
    name: "Schade",
    subject: computed(() => `Schade: ${building.value}`),
    content: computed(
      () =>
        `Beste ${mock_synidcus},\n\nWe hebben het volgende opgemerkt in uw gebouw(${building.value}):\n\t${mock_comment}\nDit is ook te zien op foto in bijlage.\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
]);

const selected_template = ref<Template>(templates[0]);
</script>
