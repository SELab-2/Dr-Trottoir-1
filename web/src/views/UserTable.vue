<template>
  <v-table>
    <thead>
    <tr>
      <th class="text-left" style="width: 1px">
        Portret
      </th>
      <th class="text-left">
        Naam
      </th>
      <th class="text-left" style="width: 1px">
        Student
      </th>
      <th class="text-left" style="width: 1px">
        Superstudent
      </th>
      <th class="text-left" style="width: 1px">
        Admin
      </th>
      <th class="text-left" style="width: 1px">
      </th>
      <th class="text-left" style="width: 1px">
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="item in users"
      :key="item.name"
    >
      <td style="display: flex; align-items: center">
        <img v-bind:src="item.portrait" class="portrait">
      </td>
      <td>{{ item.first_name }} {{item.last_name}}</td>
      <td style="text-align: center">
        <input type="checkbox" v-model="item.student">
      </td>
      <td style="text-align: center">
        <input type="checkbox" v-model="item.super_student">
      </td>
      <td style="text-align: center">
        <input type="checkbox" v-model="item.admin">
      </td>
      <td>
        <v-btn variant="plain" icon="mdi-text-box-edit-outline" size="small"></v-btn>
      </td>
      <td>
        <v-btn variant="plain" icon="mdi-trash-can-outline" size="small"></v-btn>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import chance from "chance";

export default {
  data () {
    return {
      users: [0, 0, 0, 0, 0, 0, 0].map(() => {
        return {
          portrait: `https://avatars.githubusercontent.com/u/38297449?v=4`,
          first_name: chance().first(),
          last_name: chance().last(),
          student: chance().bool(),
          super_student: chance().bool(),
          admin: chance().bool(),
        };
      }),
    }
  },
}
</script>

<style lang="sass">
tr:nth-child(even)
  background-color: #f8f8f8

td
  padding: 50px 0

td
  vertical-align: middle

.portrait
  width: 40px
  height: 40px
  object-fit: cover
  border-radius: 40px
</style>
