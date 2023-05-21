<template>
  <HFillWrapper margin="mx-4">
    <h2>Nieuw email sjabloon</h2>

    <p>
      Maak hier een nieuwe email sjabloon aan. Aan de rechterkant vindt u codes
      die u kan gebruiken voor uw email dynamisch in te laden wanneer u deze
      gebruikt.
    </p>
    <v-row class="py-0 my-0 mx-0">
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0 py-0 my-0"
      >
        <BorderCard class="mt-5">
          <v-row class="py-0 my-0 mx-0 mt-5">
            <v-col
              cols="1"
              style="min-width: 100px; max-width: 100%"
              class="flex-grow-1 flex-shrink-0 py-0 my-0 mx-3"
              ><v-text-field
                v-model="templateName"
                prepend-inner-icon="mdi-file-document-outline"
                label="Template naam"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="py-0 my-0 mx-3">
            <v-col
              cols="1"
              style="min-width: 100px; max-width: 100%"
              class="flex-grow-1 flex-shrink-0 py-0 my-0"
            >
              <v-text-field
                prepend-inner-icon="mdi-text-short"
                label="Template onderwerp"
                v-model="subject"
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
                label="Template inhoud"
                prepend-inner-icon="mdi-text"
                v-model="body"
              ></v-textarea
            ></v-col>
          </v-row>
          <v-btn
            color="primary"
            prepend-icon="mdi-content-save"
            variant="tonal"
            class="mb-6 ml-6"
            @click="saveTemplate()"
            >Opslaan</v-btn
          >
        </BorderCard> </v-col
      ><v-col
        cols="3"
        style="min-width: 250px; max-width: 100%"
        class="flex-grow-0 flex-shrink-0 py-0 my-0"
      >
        <BorderCard prepend-icon="mdi-variable" title="Variabelen" class="mt-5">
          <v-list>
            <v-list-item
              v-for="(variable, i) of variables"
              :key="i"
              class="mx-1"
            >
              <v-list-item-title>{{ variable.name }}</v-list-item-title>

              <span class="variable-description">
                {{ variable.description }}
              </span>
            </v-list-item>
          </v-list>
        </BorderCard>
      </v-col>
    </v-row>
  </HFillWrapper>
</template>

<script lang="ts" setup>
import HFillWrapper from "@/layouts/HFillWrapper.vue";
import BorderCard from "@/layouts/CardLayout.vue";
import { ref } from "vue";
import { Result, MailTemplateQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import { useRoute } from "vue-router";

const templateName = ref<string>("");
const subject = ref<string>("");
const body = ref<string>("");

const route = useRoute();
const templateId: number = Number(route.params.id);

if (templateId) {
  tryOrAlertAsync(async () => {
    const thisTemplate: Result<MailTemplateQuery> =
      await new MailTemplateQuery().getOne(templateId);

    templateName.value = thisTemplate.name;
    subject.value = thisTemplate.mail_subject;
    body.value = thisTemplate.content;
  });
}

const variables: { name: string; description: string }[] = [
  { name: "$(syndicus_voornaam)", description: "Voornaam van een syndicus" },
  {
    name: "$(syndicus_achternaam)",
    description: "Achternaam van een syndicus",
  },
  { name: "$(syndicus_naam)", description: "Volledige naam van een syndicus" },
  { name: "$(gebouw_naam)", description: "Naam van het gebouw" },
  { name: "$(gebouw_adres)", description: "Adres van het gebouw" },
  { name: "$(ivago_id)", description: "Ivago ID van het gebouw" },
];

function saveTemplate() {
  if (!templateId) {
    tryOrAlertAsync(async () => {
      await new MailTemplateQuery().createOne({
        name: templateName.value,
        mail_subject: subject.value,
        content: body.value,
      });
    });
    clearForm();
  } else {
    tryOrAlertAsync(async () => {
      await new MailTemplateQuery().updateOne({
        id: templateId,
        name: templateName.value,
        mail_subject: subject.value,
        content: body.value,
      });
    });
    clearForm();
  }
}

function clearForm() {
  templateName.value = "";
  subject.value = "";
  body.value = "";
}
</script>

<style scoped>
.variable-description {
  word-break: normal;
  overflow-wrap: break-word;
  font-size: 14px;
  color: #616161;
  display: block;
  margin-top: 4px;
}
</style>
