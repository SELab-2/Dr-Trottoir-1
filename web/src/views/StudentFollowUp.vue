<template>
  <h1>Opvolging studenten</h1>
  <v-select
    v-model="selectedRound"
    :hint="`${selectedRound.name}`"
    :items="rounds"
    item-title="name"
    label="select"
    return-object
    v-on:input="changeRound(`${selectedRound}`)"
  ></v-select>
  <div>Sorteer op dalende:
    <v-btn @click="sortedByTime">duur</v-btn>
    <v-btn @click="sortedDate">datum</v-btn>
  </div>
  <v-table>
    <thead>
    <tr>
      <th class="text-left">Datum</th>
      <th class="text-left">Student</th>
      <th class="text-left">Duur</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="student in selectedRound.students" :key="student.name">
      <td>{{ ('0'+student.date.getDate()).slice(-2) }}-{{ ('0'+(student.date.getMonth()+1)).slice(-2) }}-{{ student.date.getFullYear()}}</td>
      <td>{{ student.name }}</td>
      <td>{{ Math.floor((student.time/60000)/60) + ':' + ('0'+Math.floor((student.time/60000)%60)).slice(-2) }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  name: "StudentFollowUp",
  data() {
    // test data
    return {
      // tijd is het aantal milliseconden, want wanneer je het verschil neemt tussen twee date elementen bekom je het
      // aantal milliseconden verschil
      selectedRound: {name: "ronde 1", students: [{name: "Student 1", date: new Date(), time: 9000000},
          {name: "Student 2", date: new Date(2023, 0O2, 0O6), time: 18000000},
          {name: "Student 4", date: new Date(2023, 0O2, 0O7), time: 12000000}]},
      rounds: [{name: "ronde 1", students: [{name: "Student 1", date: new Date(), time: 9000000},
          {name: "Student 2", date: new Date(2023, 0O2, 0O6), time: 18000000},
          {name: "Student 4", date: new Date(), time: 12000000}]},
        {name: "ronde 2", students: [{name: "Student 3", date: new Date(), time: 8100000}]}]
    }
  },
  methods: {
    changeRound(a) {
      this.selectedRound = a;
    },
    sortedByTime() {
      this.selectedRound["students"] = this.selectedRound.students.sort((x, y) => { return y["time"] - x["time"] });
      console.log(this.selectedRound);
    },
    sortedDate(){
      this.selectedRound["students"]= this.selectedRound.students.sort((x, y) => { return y["date"] - x["date"] });
    },
  },
}
</script>

<style scoped>
h1{
  text-align: center;
}
</style>
