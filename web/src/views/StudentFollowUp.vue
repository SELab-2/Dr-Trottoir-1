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
  <v-table>
    <thead>
    <tr>
      <th class="text-left">Date</th>
      <th class="text-left">Student</th>
      <th class="text-left">Time</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="student in selectedRound.students" :key="student.name">
      <td>{{ ('0'+student.date.getDate()).slice(-2) }}-{{ ('0'+(student.date.getMonth()+1)).slice(-2) }}-{{ student.date.getFullYear()}}</td>
      <td>{{ student.name }}</td>
      <td>{{ student.time }}</td>
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
      selectedRound: {name: "ronde 1",
        students: [{name: "Eric Laermans", date: new Date(), time: "2u30"},
          {name: "Kris Coolsaet", date: new Date(2023, 0O2, 0O6),time: "5u"}]},
      rounds: [{name: "ronde 1", students: [{name: "Eric Laermans", date: new Date(), time: "2u30"},
          {name: "Kris Coolsaet", date: new Date(2023, 0O2, 0O6),time: "5u"}]},
        {name: "ronde 2", students: [{name: "Cristophe Scholliers", date: new Date(), time: "2u15"}]}]
    }
  },
  methods: {
    changeRound(a) {
      this.selectedRound = a;
    }
  }
}
</script>

<style scoped>
h1{
  text-align: center;
}
</style>
