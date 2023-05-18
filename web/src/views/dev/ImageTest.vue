<script setup lang="ts">
import { BuildingQuery, ProgressQuery } from "@selab-2/groep-1-query";
import { File, ProgressImage, ProgressImageType } from "@selab-2/groep-1-orm";
import { Ref, ref } from "vue";
import { ImgProxy } from "@/imgproxy";

const building = ref((await new BuildingQuery().getAll())[0]);
const progress = ref((await new ProgressQuery().getAll())[0]);
const progressDescription = ref("");
const progressType: Ref<string> = ref("GARBAGE");

const uploadBuilding = async () => {
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

const uploadProgress = async () => {
  const data = document.getElementById("upload-progress").files[0];
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

  progress.value = await new ProgressQuery().createImage(progress.value.id, {
    image_id: file.id,
    description: progressDescription.value,
    type: progressType.value as ProgressImageType,
  });
};

const removeBuilding = async (file: { id: number }) => {
  building.value = await new BuildingQuery().deleteImage(
    building.value.id,
    file,
    true,
  );
};

const removeProgress = async (file: File) => {
  progress.value = await new ProgressQuery().deleteImage(
    progress.value.id,
    file,
    true,
  );
};

const updateProgress = async (file: ProgressImage) => {
  progress.value = await new ProgressQuery().updateImage(
    progress.value.id,
    file,
  );
};
</script>

<template>
  <h1 class="pt-12 px-12">Building</h1>

  <div class="px-12 d-flex" style="gap: 24px">
    <pre>{{ JSON.stringify(building, null, 4) }}</pre>
    <div>
      <v-btn color="green" v-on:click="uploadBuilding" class="mb-4"
        >UPLOAD FILE</v-btn
      >
      <div class="my-4 pa-2 bg-white">
        <input type="file" id="upload" />
      </div>

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
          <v-btn color="red" @click="() => removeBuilding(entry.image)"
            >Delete</v-btn
          >
        </div>
      </div>
    </div>
  </div>

  <h1 class="pt-12 px-12">Progress</h1>

  <div class="px-12 d-flex" style="gap: 24px">
    <pre>{{ JSON.stringify(progress, null, 4) }}</pre>
    <div>
      <v-btn color="green" v-on:click="uploadProgress" class="mb-4"
        >UPLOAD FILE</v-btn
      >
      <div class="pa-2 my-4 bg-white">
        <input type="file" id="upload-progress" />
      </div>

      <div class="bg-white pa-2 my-4">
        <input v-model="progressDescription" placeholder="Description" />
      </div>

      <div class="bg-white pa-2 my-4">
        <select v-model="progressType">
          <option value="GARBAGE">Garbage</option>
          <option value="DEPARTURE">Departure</option>
          <option value="ARRIVAL">Arrival</option>
        </select>
      </div>

      <div
        v-for="entry in progress.images"
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

        <div class="bg-grey-lighten-2 pa-2 my-4">
          <input v-model="entry.description" placeholder="Description" />
        </div>

        <div class="bg-grey-lighten-2 pa-2 my-4">
          <select v-model="entry.type">
            <option value="GARBAGE">Garbage</option>
            <option value="DEPARTURE">Departure</option>
            <option value="ARRIVAL">Arrival</option>
          </select>
        </div>

        <div>
          <v-btn class="mr-2" color="blue" @click="() => updateProgress(entry)"
            >Update</v-btn
          >
          <v-btn color="red" @click="() => removeProgress(entry.image)"
            >Delete</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>
