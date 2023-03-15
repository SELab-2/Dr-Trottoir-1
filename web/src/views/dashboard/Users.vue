<template>
  <Table v-bind:entries="User.random()" v-bind:headers="User.headers()"></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { User } from "@/types/User";
</script>
