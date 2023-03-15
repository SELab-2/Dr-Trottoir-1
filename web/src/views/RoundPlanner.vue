<template>
  <v-card>
    <v-select
      label="Select Week"
      :items="['Even', 'Oneven']"
      v-model="week"
    ></v-select>
    <v-table>
      <thead>
        <tr>
          <th class="text-center">Naam</th>
          <th class="text-center">datum</th>
          <th class="text-center">Aantal gebouwen</th>
          <th class="text-center">Student</th>
        </tr>
      </thead>
      <tbody style="text-align: center">
        <tr v-for="item in rounds" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.date }}</td>

          <td>{{ item.aantalGebouwen }}</td>

          <td>
            <v-select
              label="Select Student"
              density="compact"
              :items="[
                'California',
                'Colorado',
                'Florida',
                'Georgia',
                'Texas',
                'Wyoming',
              ]"
            ></v-select>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const week = ref("Even");
const rounds = ref([
  { name: "Vooruit", date: "01/01/2022", aantalGebouwen: 5 },
  { name: "Station", date: "02/02/2022", aantalGebouwen: 6 },
  { name: "Koremarkt", date: "03/03/2022", aantalGebouwen: 9 },
]);
</script>

<style></style>
