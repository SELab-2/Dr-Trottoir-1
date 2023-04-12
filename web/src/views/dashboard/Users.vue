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
  <Table v-bind:entries="users" v-bind:headers="User.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { User } from "@/types/User";
import { UserQuery } from "../../../../api_query/src/user";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { ref } from "vue";

const users = ref<User[]>(await loadUsers());

async function loadUsers(): Promise<User[]> {
  const usersOrErr: User[] | APIError = await new UserQuery().getAll();
  if (usersOrErr.message == null) {
    let array = [];
    for (let user of usersOrErr) {
      array.push(new User(user));
    }
    return array;
  }
  return [];
}
</script>
