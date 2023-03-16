<template>
  <v-container fluid>
    <v-card title="Copure Gent">
      <template v-slot:append>
        <v-card-title>{{ start }} - {{ end }}</v-card-title>
        <v-card-subtitle class="text-right">5:00 uur</v-card-subtitle>
      </template>
      <v-card-subtitle>
        <v-icon icon="mdi-account"> </v-icon>{{ student }}
      </v-card-subtitle>
      <v-container class="d-flex" fluid>
        <v-timeline truncate-line="both" side="end">
          <v-timeline-item dot-color="green" icon="mdi-check">
            <v-card>
              <v-card-title> Start {{ start }} </v-card-title>
            </v-card>
          </v-timeline-item>
          <v-timeline-item
            width="100%"
            v-for="(building, id) in buildings"
            :key="id"
            dot-color="green"
            size="default"
            icon="mdi-check"
            icon-color="white"
          >
            <router-link to="/gebouw/3">
              <v-card
                width="100%"
                :title="building.name"
                :subtitle="building.adress"
              >
                <template v-slot:append>
                  <v-card-title
                    >{{ building.hour }} - {{ building.left }}</v-card-title
                  >
                  <v-card-subtitle class="text-right">{{
                    building.time
                  }}</v-card-subtitle>
                </template>
                <v-chip
                  prepend-icon="mdi-camera"
                  label
                  color="success"
                  class="pa-2 ma-2"
                >
                  {{ building.aantal }} foto's geupload
                </v-chip>
                <v-chip
                  prepend-icon="mdi-comment"
                  label
                  color="red"
                  class="pa-2 ma-2"
                  v-if="building.comments"
                >
                  Opmerkingen achtergelaten
                </v-chip>
              </v-card>
            </router-link>
          </v-timeline-item>
          <v-timeline-item dot-color="green" icon="mdi-check">
            <v-card class="mx-4 mt-4">
              <v-card-title>Einde {{ end }} </v-card-title>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
//TODO remove after mockpresentation

const buildings = [
  {
    comments: false,
    name: "Upkot",
    adress: "Witbakkerstraat 49",
    time: "15 min",
    hour: "12:00",
    left: "12:15",
    aantal: 3,
  },
  {
    comments: true,
    name: "Delhaize",
    adress: "boulevard Antoine 221",
    time: "50 min",
    hour: "12:30",
    left: "13:20",
    aantal: 7,
  },
  {
    comments: false,
    name: "Q8",
    adress: "Pastoor Goossenslaan 34",
    time: "30 min",
    hour: "14:40",
    left: "15:10",
    aantal: 3,
  },
  {
    comments: false,
    name: "Appartment 4",
    adress: "Oranjeboomstraat 345",
    time: "20 min",
    hour: "16:10",
    left: "16:30",
    aantal: 3,
  },
];

const start = "12:00";
const end = "17:00";
const student = "Sophie";
</script>
