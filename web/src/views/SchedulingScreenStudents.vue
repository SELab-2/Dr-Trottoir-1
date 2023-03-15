<template>
  <!-- Day cards -->
  <v-card
    v-for="day in sorted"
    :key="day.name"
    class="mx-4 mt-4"
    :title="day.name"
  >
    <!-- Building cards -->
    <router-link
      v-for="building in day.buildings"
      :key="building.name"
      to="/gebouwen"
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

<script>
export default {
  name: "SchedulingScreenStudents",
  data() {
    // test data
    return {
      days: {
        monday: {
          name: "Maandag",
          buildings: [
            {
              name: "gebouw1",
              address: "coolestraat 69",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
              garbage: ["PMD", "REST"],
              showinfo: false,
              done: true,
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 20, 30),
              garbage: ["GLAS"],
              showinfo: false,
              done: true,
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 21, 0),
              garbage: ["REST"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 30),
              garbage: ["PMD", "PAPIER"],
              showinfo: false,
              done: false,
            },
          ],
        },
        tuesday: {
          name: "Dinsdag",
          buildings: [
            {
              name: "gebouw1",
              address: "coolestraat 69",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 30),
              garbage: ["PMD", "REST", "GLAS"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
              garbage: ["PMD", "REST"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 22, 0),
              garbage: ["REST"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 19, 0),
              garbage: ["PAPIER"],
              showinfo: false,
              done: false,
            },
          ],
        },
        wednesday: {
          name: "Woensdag",
          buildings: [
            {
              name: "gebouw1",
              address: "coolestraat 69",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 21, 30),
              garbage: ["PMD", "PAPIER"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw2",
              address: "anderestraat 420",
              info: "wegens werken dient de achteringang genomen te worden",
              deadline: new Date(2023, 0o2, 0o6, 19, 45),
              garbage: ["REST", "PAPIER"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw3",
              address: "teamstraat 1",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 20, 0),
              garbage: ["PMD", "REST"],
              showinfo: false,
              done: false,
            },
            {
              name: "gebouw4",
              address: "geeninspiratiestraat 13",
              info: "meer info/opmerkingen",
              deadline: new Date(2023, 0o2, 0o6, 20, 30),
              garbage: ["PMD", "REST", "GLAS", "PAPIER"],
              showinfo: false,
              done: false,
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
