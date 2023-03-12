<template>
  <v-list>
    <v-list-item v-for="day in sorted" :key="day.name">
      <v-card class="dayCard">
        <v-card-item>
          <v-card-title>{{ day.name }}</v-card-title>
        </v-card-item>
        <v-list>
          <v-list-item v-for="building in day.buildings" :key="building.name">
            <v-card-item class="buildingCard">
              <v-card-title>
                <router-link to="/dashboard">{{
                  building.name
                }}</router-link></v-card-title
              >
              <v-card-subtitle>{{ building.address }} </v-card-subtitle>
              <v-card-title
                >{{ building.deadline.getHours() }}:{{
                  ("0" + building.deadline.getUTCMinutes()).slice(-2)
                }}</v-card-title
              >
              {{ building.info }}
            </v-card-item>
            <v-divider></v-divider>
          </v-list-item>
        </v-list>
      </v-card>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "SchedulingScreenStudents",
  data() {
    // test data
    return {
      days: {
        monday: {
          name: "maandag",
          buildings: [
            {
              name: "gebouw1",
              address: "coolestraat 69",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 20, 30),
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 21, 0),
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 30),
            },
          ],
        },
        tuesday: {
          name: "dinsdag",
          buildings: [
            {
              name: "gebouw1",
              address: "coolestraat 69",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 30),
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 22, 0),
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
            },
          ],
        },
        wednesday: {
          name: "woensdag",
          buildings: [
            {
              name: "gebouw1",
              address: "coolestraat 69",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 21, 30),
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 19, 45),
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 20, 0),
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 20, 30),
            },
          ],
        },
      },
    };
  },
  computed: {
    sorted() {
      let sortedDays = {};
      for (const [key, value] of Object.entries(this.days)) {
        sortedDays[key] = value;
        sortedDays[key].buildings = value.buildings.sort((x, y) => {
          return x["deadline"] - y["deadline"];
        });
      }
      return sortedDays;
    },
  },
};
</script>

<style scoped lang="scss">
@import "src/assets/styles/base";

.dayCard {
  background-color: $accent;
}

.buildingCard:hover {
  background-color: $accent;
}
</style>
