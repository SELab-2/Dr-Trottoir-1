<template>
  <v-list class="list">
    <v-list-item v-for="day in sorted" :key="day.name">
      <v-card class="dayCard">
        <v-card-item>
          <v-card-title>{{ day.name }}</v-card-title>
        </v-card-item>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="building in day.buildings" :key="building.name">
            <div class="d-flex">
              <v-sheet>
                <v-card-item class="buildingCard">
                  <v-card-title>
                    <router-link to="/gebouw/1">{{
                      building.name
                    }}</router-link></v-card-title
                  >
                  <v-card-subtitle>{{ building.address }} </v-card-subtitle>
                  <v-card-title
                    >{{ building.deadline.getHours() }}:{{
                      ("0" + building.deadline.getUTCMinutes()).slice(-2)
                    }}</v-card-title
                  >
                  <div>
                    <v-sheet class="d-flex">
                      <v-sheet
                        v-for="gb in building.garbage"
                        :key="gb"
                        class="flexbox"
                      >
                        {{ gb }}
                      </v-sheet>
                    </v-sheet>
                  </div>
                  {{ building.info }}
                </v-card-item>
              </v-sheet>
              <v-sheet>
                <v-checkbox></v-checkbox>
              </v-sheet>
            </div>
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
              garbage: ["PMD", "REST"],
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 20, 30),
              garbage: ["GLAS"],
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 21, 0),
              garbage: ["REST"],
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 30),
              garbage: ["PMD", "PAPIER"],
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
              garbage: ["PMD", "REST", "GLAS"],
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
              garbage: ["PMD", "REST"],
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 22, 0),
              garbage: ["REST"],
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
              garbage: ["PAPIER"],
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
              garbage: ["PMD", "PAPIER"],
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 19, 45),
              garbage: ["REST", "PAPIER"],
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 20, 0),
              garbage: ["PMD", "REST"],
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 20, 30),
              garbage: ["PMD", "REST", "GLAS", "PAPIER"],
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

.list {
  margin-top: -35px;
  margin-left: -35px;
  margin-right: -35px;
}

.flexbox {
  margin-right: 15px;
}

.dayCard {
  border: 1px solid lightgray;
}

.buildingCard {
  width: 250px;
}

/*
style can still be changed
.dayCard {
  background-color: $accent;
}

.buildingCard:hover {
  background-color: $accent;
}
*/
</style>
