<template>
  <Table
    v-bind:entries="Building.random()"
    v-bind:headers="Building.headers()"
  ></Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/Table.vue";
import { Building } from "@/types/Building";
</script>
