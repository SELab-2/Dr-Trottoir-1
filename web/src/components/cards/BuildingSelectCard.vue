<template>
  <BorderCard class="my-2">
    <template v-slot:prepend>
      <v-icon icon="mdi-office-building"></v-icon>
    </template>
    <template v-slot:title>{{ name }}</template
    ><template v-slot:subtitle>{{ address }}</template>
    <template v-slot:append>
      <v-icon
        @click="$emit('up')"
        class="mx-1"
        color="primary"
        icon="mdi-chevron-up"
      />
      <v-icon
        @click="$emit('down')"
        class="mx-1"
        color="primary"
        icon="mdi-chevron-down"
      />
      <v-icon
        @click="$emit('remove')"
        class="mx-1"
        color="error"
        icon="mdi-close"
      />
    </template>
    
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import { ref, onMounted } from "vue";
import { GarbageQuery } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";

// TODO: discuss with group proper format temp actions
const tempActions = ["REST", "GFT", "PMD"];
const garbageMap = ref<Map<String, Boolean[]>>(new Map());

onMounted(() => {
  for (const action of tempActions) {
    garbageMap.value.set(action, new Array(7).fill(false));
  }

  tryOrAlertAsync(async () => {
    const garbageOfBuilding = await new GarbageQuery().getAll({
      building_id: props.buildingId,
    });

    for (const garbage of garbageOfBuilding) {
      const dayIndex = new Date(garbage.pickup_time).getDay();
      const actionDesc = garbage.action.description;

      // See if it is garbage to pick up or just a task
      if (actionDesc.includes("Ophaling")) {
        const garbageType = actionDesc.split(" ")[1];

        garbageMap.value.get(
          garbageType === "restafval" ? "REST" : garbageType,
        )![dayIndex] = true;
      }
    }
  });
});

const props = defineProps({
  name: { type: String, required: true },
  address: { type: String, required: true },
  buildingId: { type: Number, required: true },
  garbageinfo: {
    type: Boolean,
    default: true,
  },
});

function handleGarbageMap(garbageType: String, day: number) {
  const planningArray = garbageMap.value.get(garbageType);
  if (planningArray) {
    return planningArray[day];
  } else {
    return false;
  }
}
</script>

<style scoped>
td {
  border-right: solid 1px rgb(216, 216, 216);
  border-left: solid 1px rgb(216, 216, 216);
}
</style>
