<template>
  <h1>Planningsoverzicht</h1>
  <v-list>
    <v-list-item v-for="day in days" :key="day.name">
      {{ day.name }}
      <v-table>
        <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Address</th>
          <th class="text-left">Deadline</th>
          <th class="text-left">Info</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="building in day.buildings" :key="building.name">
          <td>{{ building.name }}</td>
          <td>{{ building.address }}</td>
          <td>{{ building.deadline.getHours() }}:{{ ('0'+building.deadline.getUTCMinutes()).slice(-2)}}</td>
          <td>{{ building.info }}</td>
        </tr>
        </tbody>
      </v-table>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "SchedulingScreenStudents",
  data() {
    // test data
    return {
      headers: [
        { title: 'Name', align: 'start', sortable: false, key: 'name',},
        { title: 'Address', sortable: false, key: 'address' },
        { title: 'Deadline', key: 'deadline' },
        { title: 'Info', key: 'info' },],
      days: {
        monday: {name: "monday", buildings: [
          {name: "gebouw1", address: "coolestraat 69", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 19, 0)},
          {name: "gebouw2", address: "anderestraat 420", info: "wegens werken dient de achteringang genomen te worden"
            , deadline: new Date(2023, 0O2, 0O6, 20, 30)},
          {name: "gebouw3", address: "teamstraat 1", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 21, 0)},
          {name: "gebouw4", address: "geeninspiratiestraat 13", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 19, 30)}]},
        tuesday: {name: "tuesday", buildings: [
          {name: "gebouw1", address: "coolestraat 69", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 19, 30)},
          {name: "gebouw2", address: "anderestraat 420", info: "wegens werken dient de achteringang genomen te worden"
            , deadline: new Date(2023, 0O2, 0O6, 19, 0)},
          {name: "gebouw3", address: "teamstraat 1", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 22, 0)},
          {name: "gebouw4", address: "geeninspiratiestraat 13", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 19, 0)}]},
        wednesday: {name: "wednesday", buildings: [
          {name: "gebouw1", address: "coolestraat 69", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 21, 30)},
          {name: "gebouw2", address: "anderestraat 420", info: "wegens werken dient de achteringang genomen te worden"
            , deadline: new Date(2023, 0O2, 0O6, 19, 45)},
          {name: "gebouw3", address: "teamstraat 1", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 20, 0)},
          {name: "gebouw4", address: "geeninspiratiestraat 13", info: "meer info/opmerkingen"
            , deadline: new Date(2023, 0O2, 0O6, 20, 30)}]},
      }
    }
  }
}
</script>

<style scoped>
h1{
  text-align: center;
}
</style>
