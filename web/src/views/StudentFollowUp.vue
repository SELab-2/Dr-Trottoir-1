<template>
  <v-select
    v-model="selectedRound"
    :hint="`${selectedRound.name}`"
    :items="rounds"
    item-title="name"
    label="selecteer ronde"
    return-object
    v-on:input="changeRound(`${selectedRound}`)"
  ></v-select>
  <div>
    Sorteer volgens dalende:
    <v-btn class="button" @click="sortedByTime">duur</v-btn>
    <v-btn class="button" @click="sortedByDate">datum</v-btn>
  </div>
  <v-table hover:background-color="$accent" striped>
    <thead>
      <tr>
        <th>Datum</th>
        <th>Student</th>
        <th>Duur</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="student in selectedRound.students"
        :key="student.name"
        class="position-relative"
      >
        <td>
          {{ ("0" + student.date.getDate()).slice(-2) }}-{{
            ("0" + (student.date.getMonth() + 1)).slice(-2)
          }}-{{ student.date.getFullYear() }}
        </td>
        <td>
          <router-link class="stretched-link" to="/dashboard">{{
            student.name
          }}</router-link>
        </td>
        <td>
          {{
            Math.floor(student.time / 60000 / 60) +
            ":" +
            ("0" + Math.floor((student.time / 60000) % 60)).slice(-2)
          }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  name: "StudentFollowUp",
  data() {
    return {
      // time field is in milliseconds, because if you take the difference of two times, you get a value in milliseconds
      selectedRound: {
        name: "ronde 1",
        students: [
          { name: "Student 1", date: new Date(), time: 9000000 },
          { name: "Student 2", date: new Date(2023, 0o2, 0o6), time: 18000000 },
          { name: "Student 4", date: new Date(2023, 0o2, 0o7), time: 12000000 },
        ],
      },
      rounds: [
        {
          name: "ronde 1",
          students: [
            { name: "Student 1", date: new Date(), time: 9000000 },
            {
              name: "Student 2",
              date: new Date(2023, 0o2, 0o6),
              time: 18000000,
            },
            { name: "Student 4", date: new Date(), time: 12000000 },
          ],
        },
        {
          name: "ronde 2",
          students: [{ name: "Student 3", date: new Date(), time: 8100000 }],
        },
      ],
    };
  },
  methods: {
    changeRound(a) {
      this.selectedRound = a;
    },
    sortedByTime() {
      this.selectedRound["students"] = this.selectedRound.students.sort(
        (x, y) => {
          return y["time"] - x["time"];
        },
      );
      console.log(this.selectedRound);
    },
    sortedByDate() {
      this.selectedRound["students"] = this.selectedRound.students.sort(
        (x, y) => {
          return y["date"] - x["date"];
        },
      );
    },
  },
};
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

tbody tr:hover {
  background-color: $accent;
}

.stretched-link {
  position: absolute;
}

.position-relative {
  position: relative;
}
</style>
