<template>
  <!-- Card that lets you select the round -->
  <v-card title="Kies ronde" prepend-icon="mdi-transit-detour" class="ma-3">
    <template v-slot:append>
      <v-card-actions>
        <router-link to="/rondes/plannen">
          <v-btn color="primary"> Ronde plannen </v-btn>
        </router-link>
        <router-link to="/dashboard/rondes/nieuw">
          <v-btn color="primary"> Ronde aanmaken </v-btn>
        </router-link>
      </v-card-actions>
    </template>

    <v-row class="py-0 my-0 mx-1">
      <v-col>
        <v-select
          label="selecteer week"
          :items="['Week1', 'Week2', 'Week3']"
          v-model="mockDefaultWeek"
          variant="solo"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="selecteer ronde"
          :items="['Ronde 1', 'Ronde 2']"
          v-model="mockDefaultRound"
          variant="solo"
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
  <!-- Card for each student for the round-->
  <v-card
    v-for="student in mockdata.rounds[0].students"
    :key="student.firstname"
    :title="student.firstname + ' ' + student.lastname"
    class="ma-3"
  >
    <template v-slot:prepend>
      <Avatar :name="`${student.firstname} ${student.lastname}`" />
    </template>
    <template v-slot:subtitle>
      <v-chip label color="primary" class="mr-2">
        <v-icon start icon="mdi-clock-time-ten-outline"></v-icon>
        {{ ("0" + student.date.getDate()).slice(-2) }}-{{
          ("0" + (student.date.getMonth() + 1)).slice(-2)
        }}-{{ student.date.getFullYear() }}
      </v-chip>

      <v-chip label :color="student.done ? 'success' : 'error'">
        <v-icon
          start
          :icon="student.done ? 'mdi-check' : 'mdi-exclamation'"
        ></v-icon>
        {{ student.done ? "Klaar" : "Niet klaar" }}
      </v-chip>
    </template>
    <template v-slot:append>
      <v-btn
        to="/dashboard/ronde/rapport"
        prepend-icon="mdi-file-eye"
        color="primary"
        >Details</v-btn
      >
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Avatar from "@/components/Avatar.vue";

const mockDefaultWeek = ref("Week 1");
const mockDefaultRound = ref("Ronde 1");

const mockdata = ref({
  name: "Week 1",
  rounds: [
    {
      name: "ronde 1",
      students: [
        {
          firstname: "Jef",
          lastname: "Janssens",
          date: new Date(2023, 2, 6),
          done: true,
        },
        {
          firstname: "Guust",
          lastname: "Flater",
          date: new Date(2023, 2, 7),
          done: true,
        },
        {
          firstname: "Jan",
          lastname: "Jaap",
          date: new Date(2023, 2, 8),
          done: false,
        },
      ],
    },
    {
      name: "ronde 2",
      students: [
        {
          firstname: "Jef",
          lastname: "Janssens",
          date: new Date(2023, 2, 7),
          done: true,
        },
      ],
    },
  ],
});
</script>

<style scoped lang="scss">
@import "src/assets/styles/base";

.button {
  padding: 10px;
  margin-left: 10px;
  background-color: lightgray;
}

.button:hover {
  background-color: $accent;
}

/*

hover:background-color="$accent" in table header

tbody tr:hover {
  background-color: $accent;
}

.v-expansion-panel:hover{
  background-color: $accent;
}
*/
</style>
