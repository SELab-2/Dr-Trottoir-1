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
  <Table v-bind:entries="users" v-bind:headers="UserEntity.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { UserEntity } from "@/types/UserEntity";
import { User } from "@selab-2/groep-1-orm";
import { UserQuery } from "@selab-2/groep-1-query/dist/user";
import { APIError } from "@selab-2/groep-1-query/dist/api_error";
import { ref } from "vue";

const users = ref<UserEntity[]>(await loadUsers());

async function loadUsers(): Promise<UserEntity[]> {
  const usersOrErr: User[] | APIError = await new UserQuery().getAll();
  // @ts-ignore
  if (usersOrErr.message == null) {
    let array = [];
    for (let user of usersOrErr) {
      array.push(new UserEntity(user));
    }
    return array;
  }
  return [];
}
</script>
