<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'user_new' }"
    >
      Nieuwe Gebruiker
    </v-btn>
  </div>
  <!-- hier moet usersOrError komen -->
  <Table v-bind:entries="User.random()" v-bind:headers="User.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { User } from "@/types/User";
import { UserQuery } from "../../../../api_query/src/user";

process.env.API_SERVER_ADDRESS = "/"
process.env.VUE_APP_API_SERVER_ADDRESS = "/"

const usersOrErr: User[] | APIError = new UserQuery().getAll();
</script>
