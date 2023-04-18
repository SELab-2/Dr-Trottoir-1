<template>
  <CardLayout
    class="building-card"
    @click="router.push({ name: 'building_id', params: { id: building.id } })"
  >
    <div>
      <h3>{{ building.name }}</h3>
      <p>{{ building.address.street }} {{ building.address.number }}</p>
      <p>{{ building.address.zip_code }} {{ building.address.city }}</p>
    </div>
    <div class="flex-grow-1"></div>
    <v-icon icon="mdi-chevron-right"></v-icon>
  </CardLayout>
</template>

<script lang="ts" setup>
import router from "@/router";
import CardLayout from "@/layouts/CardLayout.vue";
import { BuildingQuery, Result } from "@selab-2/groep-1-query";

defineProps<{
  building: Result<BuildingQuery>;
}>();
</script>

<style lang="sass"></style>
