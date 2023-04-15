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
import { User as OrmUser } from "@selab-2/groep-1-orm";
import { UserQuery } from "@selab-2/groep-1-query";
const users: User[] = await loadUsers();
async function loadUsers(): Promise<User[]> {
  try {
    const usersOrErr: OrmUser[] = await new UserQuery().getAll();
    let array = [];
    for (let user of usersOrErr) {
      array.push(new User(user));
    }
    return array;
  } catch (e) {
    alert("Kon gebruikers niet ophalen, probeer het later opnieuw.");
    return [];
  }
}
</script>
