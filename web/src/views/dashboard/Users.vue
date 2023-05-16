<template>
  <div class="d-flex flex-row-reverse">
    <v-btn
      v-if="useAuthStore().auth?.admin"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3 text-none"
      :to="{ name: 'user_new' }"
    >
      Nieuwe Gebruiker
    </v-btn>
  </div>
  <DashBoardSearch
    :admin="useAuthStore().auth?.admin"
    @changed="(a, b) => getUsers(a, b)"
  />
  <Table
    :key="users.length"
    :entries="users"
    :headers="User.headers()"
    :route="User.route"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import DashBoardSearch from "@/components/filter/DashBoardSearch.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, Ref } from "vue";
import { User } from "@/types/User";
import { Result, UserQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

const users: Ref<Array<Result<UserQuery>>> = ref([]);
await getUsers(false, "");

async function getUsers(showDeleted: boolean, search: string) {
  console.log("TODO: filter with: " + search);
  users.value =
    (await tryOrAlertAsync<Array<Result<UserQuery>>>(async () => {
      if (showDeleted) {
        return await new UserQuery().getAll({ deleted: true });
      }
      return await new UserQuery().getAll({});
    })) ?? [];
}
</script>
