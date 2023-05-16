<template>
  <HFillWrapper margin="mx-4">
    <BorderCard>
      <template v-slot:title
        ><div class="ml-2">Sjabloon: {{ template?.name }}</div></template
      >

      <template v-slot:append>
        <div class="d-flex">
          <v-btn class="text-none mr-1" prepend-icon="mdi-pencil" @click="">
            {{ "Bewerk template" }}
          </v-btn>
          <v-btn class="text-none ml-1" prepend-icon="mdi-close" @click="">
            {{ "Verwijder template" }}
          </v-btn>
        </div>
      </template>
      <v-row class="py-0 my-0 mx-3">
        <v-col
          cols="1"
          style="min-width: 100px; max-width: 100%"
          class="flex-grow-1 flex-shrink-0 py-0 my-0"
        >
          <v-text-field
            readonly
            prepend-inner-icon="mdi-text-short"
            label="Template onderwerp"
            :model-value="template?.mail_subject"
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
          <v-textarea
            rows="17"
            readonly
            label="Template inhoud"
            prepend-inner-icon="mdi-text"
            :model-value="template?.content"
          ></v-textarea
        ></v-col>
      </v-row>
    </BorderCard>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { ref, onMounted } from "vue";
import {
  Result,
  MailTemplateQuery,
  BuildingQuery,
} from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRoute } from "vue-router";

const route = useRoute();
const templateId: number = Number(route.params.id);
const template = ref<Result<MailTemplateQuery>>();

const exampleBuilding = ref<Result<BuildingQuery>>();

onMounted(() => {
  tryOrAlertAsync(async () => {
    template.value = await new MailTemplateQuery().getOne(templateId);
  });
});
</script>
