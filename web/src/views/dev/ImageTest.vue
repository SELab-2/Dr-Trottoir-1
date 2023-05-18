<script setup lang="ts">
import { BuildingQuery } from "@selab-2/groep-1-query";
import { File } from "@selab-2/groep-1-orm";
import { ref } from "vue";
import { ImgProxy } from "@/imgproxy";

const building = ref((await new BuildingQuery().getAll())[0]);

const upload = async () => {
  const data = document.getElementById("upload").files[0];
  const form = new FormData();
  form.append("file", data);

  const file = (await fetch("http://localhost:8080/file", {
    method: "POST",
    body: form,
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    redirect: "error",
  }).then((res) => {
    return res.json();
  })) as File;

  building.value = await new BuildingQuery().createImage(
    building.value.id,
    file,
  );
};

const remove = async (file: { id: number }) => {
  building.value = await new BuildingQuery().deleteImage(
    building.value.id,
    file,
    true,
  );
};
</script>

<template>
  <div class="pa-12 d-flex" style="gap: 24px">
    <pre>{{ JSON.stringify(building, null, 4) }}</pre>
    <div>
      <v-btn color="green" v-on:click="upload" class="mb-2 mr-2"
        >UPLOAD FILE</v-btn
      >
      <input type="file" id="upload" />
      <div
        v-for="entry in building.images"
        v-bind:key="entry.id"
        style="background: white"
        class="my-4 pa-4"
      >
        <pre>DIRECT URL: http://localhost:8080/file/{{ entry.image.id }}</pre>
        <pre>IMGPROXY: {{ ImgProxy.env.url(entry.image) }}</pre>
        <img
          :src="ImgProxy.env.url(entry.image)"
          style="width: 400px; height: 400px; object-fit: cover"
        />
        <div>
          <v-btn color="red" @click="() => remove(entry.image)">Delete</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
