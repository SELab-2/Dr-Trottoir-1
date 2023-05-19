<template>
  <CardLayout style="height: 400px">
    <l-map ref="map" v-model:zoom="zoom" :center="loc(buildings[0])">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
      <l-marker
        v-for="(building, index) in buildings"
        :key="building.id"
        :lat-lng="loc(building)"
        name="test"
      >
        <l-tooltip :options="{ permanent: true }">
          {{ index + 1 }}. {{ building.name }}
        </l-tooltip>
      </l-marker>
      <l-polyline
        :latLngs="polylines"
        :options="{ color: 'red' }"
      ></l-polyline>
    </l-map>
  </CardLayout>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";
import CardLayout from "@/layouts/CardLayout.vue";
import { BuildingQuery, Result } from "@selab-2/groep-1-query";
import { LMap, LTileLayer, LMarker, LTooltip, LPolyline } from "@vue-leaflet/vue-leaflet";
import { ref,computed } from "vue";

const zoom = ref(14);

const props = defineProps<{
  buildings: Array<Result<BuildingQuery>>;
}>();

function loc(building: Result<BuildingQuery>): [number, number] {
  if (!building) return [0, 0];
  return [building.address.latitude, building.address.longitude];
}

const polylines = computed(() => props.buildings.map(loc));

</script>
