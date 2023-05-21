<template>
  <div class="toprow">
    <SimpleButton
      v-if="useAuthStore().auth?.admin"
      prepend-icon="mdi-plus"
      color="primary"
      class="mr-3"
      :to="{ name: 'user_new' }"
    >
      Nieuwe Gebruiker
    </SimpleButton>
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
import SimpleButton from "@/components/buttons/SimpleButton.vue";

const users: Ref<Array<Result<UserQuery>>> = ref([]);
await getUsers(false, "");

async function getUsers(showDeleted: boolean, search: string) {
  users.value =
    (await tryOrAlertAsync<Array<Result<UserQuery>>>(async () => {
      const results = await new UserQuery().getAll({ deleted: showDeleted });
      return results.filter((user) =>
        (user.first_name + " " + user.last_name)
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    })) ?? [];
}
</script>

<style scoped lang="scss">
.toprow {
  z-index: 1000;
  position: fixed;
  top: 14px;
  right: 4px;
}
</style>
