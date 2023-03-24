<template>
  <v-row class="mt-1">
    <v-col cols="1" class="flex-grow-1 flex-shrink-0" style="max-width: 100%" />
    <v-col cols="7" style="min-width: 400px">
      <LargeFilter
        :search_by_labels="query_labels"
        :filter_labels="filter_labels"
        :sort_items="sort_items"
        :filter_items="filter_options"
        class="mx-1 mb-3"
        @onUpdate="(new_data: Filterdata) => filter_data = new_data"
      />
      <div v-for="(building, id) in buildings" :key="id">
        <v-card
          class='pa-4 my-4'
          @click="
            this.$router.push({
              name: 'Gebouw detail',
              params: { id: 5, date: new Date() },
            })
          "
        >
          {{ building }}
        </v-card>
      </div>
      <v-spacer></v-spacer>
    </v-col>
    <v-col cols="1" class="flex-grow-1 flex-shrink-0" style="max-width: 100%">
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import LargeFilter from "@/components/LargeFilter.vue";
const query_labels = ["Gebouw"];
const filter_labels = ["Naam", "Naam + Datum"];
const filter_options = ["Opmerkingen"];
const sort_items = ["Naam", "Datum"];

// TODO: mockdata, remove in future
const buildings: string[] = [
  "Eiffeltoren",
  "Taj Mahal",
  "Machu Picchu",
  "Piramide",
  "Atomium",
  "Toren van Pisa",
];
</script>

<style scoped lang="scss"></style>
