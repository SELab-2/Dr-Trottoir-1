<template>
  <!-- Day cards -->
  <v-card
    v-for="day in days"
    :key="day.name"
    class="mx-4 mt-4"
    :title="day.name"
  >
    <!-- Building cards -->
    <router-link
      v-for="building in day.buildings"
      :key="building.name"
      to="/gebouw/0"
    >
      <v-card
        class="ma-3"
        :title="building.name"
        :subtitle="building.address"
        prepend-icon="mdi-office-building-outline"
      >
        <template v-slot:append>
          <v-checkbox v-on:click.prevent v-model="building.done"></v-checkbox>
        </template>

        <!-- hour -->
        <v-chip
          prepend-icon="mdi-clock-time-ten-outline"
          label
          color="primary"
          class="ml-5"
        >
          {{ building.deadline.getHours() }}:{{
            ("0" + building.deadline.getUTCMinutes()).slice(-2)
          }}
        </v-chip>

        <!-- Trash types -->
        <v-chip
          prepend-icon="mdi-recycle"
          label
          color="success"
          v-for="gb in building.garbage"
          :key="gb"
          class="ml-2"
        >
          {{ gb }}
        </v-chip>

        <v-card-actions>
          <v-btn
            v-on:click.prevent
            :prepend-icon="
              building.showinfo ? 'mdi-chevron-up' : 'mdi-chevron-down'
            "
            @click="building.showinfo = !building.showinfo"
            >Opmerkingen</v-btn
          >
        </v-card-actions>

        <v-expand-transition>
          <div v-show="building.showinfo">
            <v-divider></v-divider>
            <v-card-text>
              {{ building.info }}
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </router-link>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const days = ref({
  monday: {
    name: "Maandag",
    buildings: [
      {
        name: "Upkot",
        address: "Herentalsebaan 427",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 21, 30),
        garbage: ["PMD", "PAPIER"],
        showinfo: false,
        done: true,
      },
      {
        name: "Leftkot",
        address: "Rue Dielhère 403",
        info: "wegens werken dient de achteringang genomen te worden",
        deadline: new Date(2023, 0o2, 0o6, 19, 45),
        garbage: ["REST", "PAPIER"],
        showinfo: false,
        done: true,
      },
      {
        name: "Home Johannes",
        address: "Kerkstraat 122",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 20, 0),
        garbage: ["PMD", "REST"],
        showinfo: false,
        done: false,
      },
      {
        name: "Appartmentblok 2.3",
        address: "Aven Ackers 193",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 20, 30),
        garbage: ["PMD", "REST", "GLAS", "PAPIER"],
        showinfo: false,
        done: false,
      },
    ],
  },
  tuesday: {
    name: "Dinsdag",
    buildings: [
      {
        name: "Upkot",
        address: "Herentalsebaan 427",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 21, 30),
        garbage: ["PMD", "PAPIER"],
        showinfo: false,
        done: false,
      },
      {
        name: "Leftkot",
        address: "Rue Dielhère 403",
        info: "wegens werken dient de achteringang genomen te worden",
        deadline: new Date(2023, 0o2, 0o6, 19, 45),
        garbage: ["REST", "PAPIER"],
        showinfo: false,
        done: false,
      },
      {
        name: "Home Johannes",
        address: "Kerkstraat 122",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 20, 0),
        garbage: ["PMD", "REST"],
        showinfo: false,
        done: false,
      },
      {
        name: "Appartmentblok 2.3",
        address: "Aven Ackers 193",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 20, 30),
        garbage: ["PMD", "REST", "GLAS", "PAPIER"],
        showinfo: false,
        done: false,
      },
    ],
  },
  wednesday: {
    name: "Woensdag",
    buildings: [
      {
        name: "Upkot",
        address: "Herentalsebaan 427",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 21, 30),
        garbage: ["PMD", "PAPIER"],
        showinfo: false,
        done: false,
      },
      {
        name: "Leftkot",
        address: "Rue Dielhère 403",
        info: "wegens werken dient de achteringang genomen te worden",
        deadline: new Date(2023, 0o2, 0o6, 19, 45),
        garbage: ["REST", "PAPIER"],
        showinfo: false,
        done: false,
      },
      {
        name: "Home Johannes",
        address: "Kerkstraat 122",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 20, 0),
        garbage: ["PMD", "REST"],
        showinfo: false,
        done: false,
      },
      {
        name: "Appartmentblok 2.3",
        address: "Aven Ackers 193",
        info: "meer info/opmerkingen",
        deadline: new Date(2023, 0o2, 0o6, 20, 30),
        garbage: ["PMD", "REST", "GLAS", "PAPIER"],
        showinfo: false,
        done: false,
      },
    ],
  },
});
</script>
