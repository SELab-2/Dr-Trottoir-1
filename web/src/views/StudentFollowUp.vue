<template>
  <v-select
    v-model="selectedWeek"
    :hint="`${selectedWeek.name}`"
    :items="weeks"
    item-title="name"
    label="selecteer week"
    return-object
    v-on:input="
      changeWeek(`${selectedWeek}`);
      changeRound(`${selectedWeek.rounds[0]}`);
    "
  ></v-select>

  <v-select
    v-model="selectedRound"
    :hint="`${selectedRound.name}`"
    :items="selectedWeek.rounds"
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
  <v-table>
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
          <router-link to="/dashboard">{{ student.name }}</router-link>
        </td>
        <td>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>{{
                Math.floor(student.time / 60000 / 60) +
                ":" +
                ("0" + Math.floor((student.time / 60000) % 60)).slice(-2)
              }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-timeline direction="horizontal">
                  <v-timeline-item
                    v-for="detail in student.details"
                    :key="detail"
                  >
                    <template v-slot:opposite>
                      <div v-text="detail.building"></div>
                      <div>
                        {{
                          detail.start.getHours() +
                          ":" +
                          ("0" + detail.start.getMinutes()).slice(-2) +
                          " - " +
                          detail.end.getHours() +
                          ":" +
                          ("0" + detail.end.getMinutes()).slice(-2)
                        }}
                      </div>
                    </template>
                  </v-timeline-item>
                </v-timeline>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
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
      weeks: [
        {
          name: "week 1",
          rounds: [
            {
              name: "ronde 1",
              students: [
                {
                  name: "Student 1",
                  date: new Date(2023, 2, 7),
                  time: 9000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
                {
                  name: "Student 2",
                  date: new Date(2023, 2, 6),
                  time: 18000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
                {
                  name: "Student 4",
                  date: new Date(2023, 2, 8),
                  time: 12000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
              ],
            },
            {
              name: "ronde 2",
              students: [
                {
                  name: "Student 3",
                  date: new Date(),
                  time: 8100000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "week 2",
          rounds: [
            {
              name: "ronde 1",
              students: [
                {
                  name: "Student 1",
                  date: new Date(),
                  time: 9000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
                {
                  name: "Student 2",
                  date: new Date(2023, 2, 13),
                  time: 18000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
                {
                  name: "Student 4",
                  date: new Date(),
                  time: 12000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
              ],
            },
            {
              name: "ronde 2",
              students: [
                {
                  name: "Student 3",
                  date: new Date(2023, 3, 17),
                  time: 8100000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
                {
                  name: "Student 4",
                  date: new Date(2023, 3, 18),
                  time: 8000000,
                  details: [
                    { building: "gebouw", start: new Date(), end: new Date() },
                    { building: "gebouw", start: new Date(), end: new Date() },
                  ],
                },
              ],
            },
          ],
        },
      ],
      selectedWeek: {
        name: "week 1",
        rounds: [
          {
            name: "ronde 1",
            students: [
              { name: "Student 1", date: new Date(2023, 2, 7), time: 9000000 },
              {
                name: "Student 2",
                date: new Date(2023, 2, 6),
                time: 18000000,
                details: [
                  { building: "gebouw", start: new Date(), end: new Date() },
                  { building: "gebouw", start: new Date(), end: new Date() },
                ],
              },
              {
                name: "Student 4",
                date: new Date(2023, 2, 8),
                time: 12000000,
                details: [
                  { building: "gebouw", start: new Date(), end: new Date() },
                  { building: "gebouw", start: new Date(), end: new Date() },
                ],
              },
            ],
          },
          {
            name: "ronde 2",
            students: [
              {
                name: "Student 3",
                date: new Date(),
                time: 8100000,
                details: [
                  { building: "gebouw", start: new Date(), end: new Date() },
                  { building: "gebouw", start: new Date(), end: new Date() },
                ],
              },
            ],
          },
        ],
      },
      selectedRound: {
        name: "ronde 1",
        students: [
          {
            name: "Student 1",
            date: new Date(2023, 2, 7),
            time: 9000000,
            details: [
              { building: "gebouw", start: new Date(), end: new Date() },
              { building: "gebouw", start: new Date(), end: new Date() },
            ],
          },
          {
            name: "Student 2",
            date: new Date(2023, 2, 6),
            time: 18000000,
            details: [
              { building: "gebouw", start: new Date(), end: new Date() },
              { building: "gebouw", start: new Date(), end: new Date() },
            ],
          },
          {
            name: "Student 4",
            date: new Date(2023, 2, 8),
            time: 12000000,
            details: [
              { building: "gebouw", start: new Date(), end: new Date() },
              { building: "gebouw", start: new Date(), end: new Date() },
            ],
          },
        ],
      },
    };
  },
  methods: {
    changeWeek(week) {
      this.selectedWeek = week;
    },
    changeRound(round) {
      this.selectedRound = round;
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
