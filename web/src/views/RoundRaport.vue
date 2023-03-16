<template>
  <v-card>
    


    <template v-slot:title>
    Vooruit
    </template>
  
    
    <v-card-text>
          
          
      <div class="font-weight-bold ms-1 mb-2">
        Today
      </div>
      
      <v-timeline density="compact" align="start">
        <v-timeline-item
          v-for="building in buildings"
          :key="building.name"
          size="x-small"
          style="cursor:pointer"
        >
          <div class="mb-4">
            <div class="font-weight-normal">
              <strong>{{ building.name }}</strong> @{{ building.hour}}
            </div>
            <div>{{ building.time }}</div>
            <div>Aantal afbeeldingen: {{ building.aantal }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const buildings = ref([
  {name: "Start", time:"", hour:"12:30", aantal:1},
  { name: "Atom", time: "50min", hour:"12:30", aantal: 4},
  { name: "Spark", time: "30min", hour: "14:40", aantal: 6},
  { name: "Advenger", time: "20min", hour: "16:10", aantal: 7},
  {name: "Einde", time:"", hour:"16:30", aantal:1},
]);


</script>
