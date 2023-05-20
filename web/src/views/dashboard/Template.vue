<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      v-if="useAuthStore().auth?.admin || useAuthStore().auth?.super_student"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3 text-none"
      :to="{ name: 'template_new' }"
    >
      Nieuwe template
    </v-btn>
  </div>
  <Table :entries="templates" :headers="Template.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { useAuthStore } from "@/stores/auth";
import { Template } from "@/types/Template";
import { MailTemplateQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const templates: Array<Result<MailTemplateQuery>> =
  (await tryOrAlertAsync<Array<Result<MailTemplateQuery>>>(async () => {
    return await new MailTemplateQuery().getAll({});
  })) ?? [];
</script>
