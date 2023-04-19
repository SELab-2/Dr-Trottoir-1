<template>
  <HFillWrapper margin="mx-4">
    <h2>Contactformulier</h2>

    <p>
      Je bericht wordt per mail verstuurd naar de syndicus van het geselecteerde
      gebouw.
    </p>

    <BorderCard
      prepend-icon="mdi-account-details"
      title="Persoonlijke gegevens"
      class="mt-5"
    >
      <v-row class="py-0 my-0 mx-3">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <v-select
            label="Gebouw"
            :items="buildings"
            v-model="building"
            :item-title="'test'"
            prepend-inner-icon="mdi-office-building"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.name"
                :subtitle="item.name"
              >
                <p>{{ item.value.name }}</p>
              </v-list-item>
            </template>

            <template v-slot:selection="{ item }">
              <p>{{ item.value.name }}</p>
            </template>
          </v-select>
        </v-col>

        <v-col cols="3" class="flex-grow-0 flex-shrink-0 py-0 my-0">
          <v-select
            label="Sjabloon"
            v-model="selected_template"
            :items="templates"
            :item-value="'name'"
            :item-title="'name'"
            return-object
            prepend-inner-icon="mdi-list-box"
            :disabled="building === null"
          >
          </v-select>
        </v-col>
      </v-row>
      <!-- TODO: Show syndicus for convenience. Something goes wrong here. -->
      <v-row class="py-0 my-0 mx-3">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <v-text-field
            prepend-inner-icon="mdi-text-short"
            label="Onderwerp"
            :model-value="selected_template.subject"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="py-0 my-0 mx-3"
        ><v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
          ><v-file-input
            prepend-icon=""
            prepend-inner-icon="mdi-upload"
            label="Bestanden"
          ></v-file-input></v-col
      ></v-row>
      <v-row class="py-0 my-0 mx-3"
        ><v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <v-textarea
            rows="17"
            label="Inhoud"
            :model-value="selected_template.content"
          ></v-textarea
        ></v-col>
      </v-row>
      <v-btn
        color="primary"
        prepend-icon="mdi-send"
        variant="tonal"
        class="mb-6 ml-6"
        >Versturen</v-btn
      >
    </BorderCard>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import Template from "@/components/models/Template";
import { ref, computed, reactive, Ref } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { tryOrAlertAsync } from "@/try";
import { Result, BuildingQuery } from "@selab-2/groep-1-query";

const building: Ref<Result<BuildingQuery> | null> = ref(null);

const buildings =
  (await tryOrAlertAsync<Array<Result<BuildingQuery>>>(async () => {
    return await new BuildingQuery().getAll({});
  })) ?? [];

const templates: Template[] = reactive([
  { name: "Andere", subject: "", content: "" },
  {
    name: "Opmerking",
    subject: computed(() => `Opmerking: ${building.value?.name}`),
    content: computed(
      () =>
        `Beste ${building?.value?.syndicus?.user.first_name},\n\nWij hebben een opmerking ontvangen..\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
  {
    name: "Klacht",
    subject: computed(() => `Klacht: ${building.value?.name}`),
    content: computed(
      () =>
        `Beste ${building?.value?.syndicus?.user.first_name},\n\nWij zijn ontevreden met..\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
  {
    name: "Schade",
    subject: computed(() => `Schade: ${building.value?.name}`),
    content: computed(
      () =>
        `Beste ${building?.value?.syndicus?.user.first_name},Wij hebben schade vastgesteld..\n\nMet vriendelijke groeten,\nDr Trottoir team`,
    ),
  },
]);

const selected_template = ref<Template>(templates[0]);
</script>
