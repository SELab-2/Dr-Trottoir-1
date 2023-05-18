<script setup lang="ts">

import {BuildingQuery} from "@selab-2/groep-1-query";

const building = (await new BuildingQuery().getAll())[0];

const upload = async () => {
  const file = document.getElementById("upload").files[0];
  let data = new FormData();
  data.append("file", file);
  const res = await fetch("http://localhost:8080/file", {
    method: "POST",
    body: data,
  });
  alert(JSON.stringify(res, null, 4));
}
</script>

<template>
  <div class="pa-12">
    <pre class="my-6">{{JSON.stringify(building, null, 4)}}</pre>
    <div v-for="image in building.images" v-bind:key="image.id" class="my-6">
      <pre>http://localhost:8080/file/{{image.image.id}}</pre>
      <img :src="`http://localhost:8081/insecure/plain/local://files/${image.image.path}`" style="width: 400px; height: 400px; object-fit: cover">
      <div>
        <button>Delete</button>
      </div>
    </div>
    <button v-on:click="upload">UPLOAD FILE</button>
    <input type="file" id="upload">
  </div>
</template>

<style scoped lang="sass">

</style>
