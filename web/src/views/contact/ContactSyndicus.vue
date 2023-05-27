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

        <v-col cols="5" class="flex-grow-1 flex-shrink-0 py-0 my-0">
          <v-select
            label="Sjabloon"
            v-model="selected_template"
            :items="allTemplates"
            :item-value="'name'"
            :item-title="'name'"
            return-object
            prepend-inner-icon="mdi-list-box"
            :disabled="building === null"
            @update:model-value="updateFields()"
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
            v-model="subject"
            prepend-inner-icon="mdi-text-short"
            label="Onderwerp"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="py-0 my-0 mx-3"
        ><v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <v-textarea v-model="content" rows="17" label="Inhoud"></v-textarea
        ></v-col>
      </v-row>
      <v-btn
        color="primary"
        prepend-icon="mdi-send"
        variant="tonal"
        class="mb-6 ml-6"
        @click="sendMail()"
        >Versturen</v-btn
      >
    </BorderCard>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { tryOrAlertAsync } from "@/try";
import {
  Result,
  BuildingQuery,
  MailTemplateQuery,
  MailQuery,
} from "@selab-2/groep-1-query";
import { parseTemplate } from "@/assets/scripts/templateParser";
import { useRoute } from "vue-router";

const allTemplates = ref<Result<MailTemplateQuery>[]>([]);
const selected_template = ref<Result<MailTemplateQuery>>();

const buildings = ref<Result<BuildingQuery>[]>();
const building = ref<Result<BuildingQuery>>();

const subject = ref<string>("");
const content = ref<string>("");

const route = useRoute();
const buildingId: number = Number(route.params.id);

onMounted(() => {
  tryOrAlertAsync(async () => {
    allTemplates.value = await new MailTemplateQuery().getAll();
  });

  tryOrAlertAsync(async () => {
    buildings.value = await new BuildingQuery().getAll();
  });

  tryOrAlertAsync(async () => {
    building.value = await new BuildingQuery().getOne(buildingId);
  });
});

function parseString(str: string | undefined): string {
  if (building.value && str) {
    return parseTemplate(building.value, str);
  }
  return "";
}
function updateFields() {
  subject.value = parseString(selected_template?.value?.mail_subject);
  content.value = parseString(selected_template?.value?.content);
}
function sendMail() {
  tryOrAlertAsync(async () => {
    await new MailQuery().createOne({
      to: building.value?.syndicus.email,
      subject: subject.value,
      content: content.value,
    });

    subject.value = "";
    content.value = "";
  });
}
</script>
