<template>
  <Table
    v-bind:entries="Routes.random()"
    v-bind:headers="Routes.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Routes } from "@/types/Routes";
</script>
