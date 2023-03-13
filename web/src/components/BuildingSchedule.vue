<template xmlns='http://www.w3.org/1999/html'>
  <v-card class='building-schedule' :title='"Planning voor gebouw " + id'>
    <v-table>
      <thead>
        <tr>
          <th></th>
          <th>Maandag</th>
          <th>Dinsdag</th>
          <th>Woensdag</th>
          <th>Donderdag</th>
          <th>Vrijdag</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='name in ["test1", "test2", "test3"]' :key='name'>
          <th>{{name}}</th>
          <td v-for='getal in [...Array(5).keys()]' :key='name+getal'>
            {{randomAfval()}}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script>
export default {
  name: 'BuildingSchedule',
  props: {
    id: String
  },
  methods: {
    randomAfval(){
      const afvalSoorten = ["PMD", "REST", "GFT", "PAPIER", "GLAS", "", "", "", ""];
      return afvalSoorten[Math.floor(Math.random()*afvalSoorten.length)];
    }
  }
}
</script>

<style scoped lang="scss">
  @import 'src/assets/styles/base';
</style>
