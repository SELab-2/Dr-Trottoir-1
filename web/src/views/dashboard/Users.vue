<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      id="newuser"
      v-if="useAuthStore().auth?.admin"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3 text-none"
      :to="{ name: 'user_new' }"
    >
      Nieuwe Gebruiker
    </v-btn>
  </div>
  <Table
    id="usertable"
    :entries="users"
    :headers="User.headers()"
    :route="User.route"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { useAuthStore } from "@/stores/auth";
import { User } from "@/types/User";
import { Result, UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const users: Array<Result<UserQuery>> =
  (await tryOrAlertAsync<Array<Result<UserQuery>>>(async () => {
    return await new UserQuery().getAll({});
  })) ?? [];
</script>
