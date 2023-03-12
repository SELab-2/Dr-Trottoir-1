<template>
    <v-container fluid>
      <!-- select container and corresponding table when a student is selected -->
      <!-- TODO: rework this when API is ready to use -->
      <v-select label="Student" :items="students" v-model="selectedstudent"></v-select>
      <v-table v-if="selectedstudent" height="600px">
        <thead>
          <tr>
            <th v-for="category in categories" class="text-left">{{ category }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in mockrounddata" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.done }}</td>
            <td>{{ item.deltatime }}</td>
            <td>{{ item.comments }}</td>
            <td>{{ item.amount_of_pics }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  
  // reactive component which will store the current user
  const selectedstudent = ref<String>("");
  
  // current categories that will be displayed
  const categories: string[] = [
    "Gebouw",
    "Afgewerkt",
    "Verstreken tijd",
    "Opmerkingen",
    "Aantal geuploade fotos",
  ];
  
  // TODO: mockdata for students, remove in future
  const students: string[] = [
    "Michael",
    "Christopher",
    "Jessica",
    "Matthew",
    "Ashley",
    "Jennifer",
    "Joshua",
  ];
  
  // TODO: mockdata for rounds, remove in future
  const mockrounddata: any[] = [
    {
      name: "Navarro",
      done: "2005-10-20 23:59:06",
      deltatime: "52 min",
      comments: "nee",
      amount_of_pics: "3",
    },
    {
      name: "Anderson",
      done: "1955-05-17 11:28:26",
      deltatime: "24 min",
      comments: "ja",
      amount_of_pics: "3",
    },
    {
      name: "Talbert",
      done: "1962-12-25 08:08:46",
      deltatime: "58 min",
      comments: "ja",
      amount_of_pics: "5",
    },
    {
      name: "Odonal",
      done: "2013-10-24 14:36:18",
      deltatime: "8 min",
      comments: "nee",
      amount_of_pics: "4",
    },
    {
      name: "Sanchez",
      done: "1986-09-03 22:29:30",
      deltatime: "1 min",
      comments: "nee",
      amount_of_pics: "3",
    },
    {
      name: "Frank",
      done: "TBD",
      deltatime: "TBD",
      comments: "/",
      amount_of_pics: "3",
    },
    {
      name: "Leon",
      done: "TBD",
      deltatime: "TBD",
      comments: "/",
      amount_of_pics: "0",
    },
    {
      name: "Azelf",
      done: "TBD",
      deltatime: "TBD",
      comments: "/",
      amount_of_pics: "0",
    },
  ];
  </script>
  