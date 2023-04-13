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
    <v-expand-transition>
      <v-table v-show="garbageinfo" class="mx-2 my-2" density="compact">
        <thead>
          <tr>
            <th
              v-for="day in ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO']"
              :key="day"
              class="text-center"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ['REST', 'GFT', 'PMD', 'PAPIER']" :key="item">
            <td class="text-center" v-for="afval in 7" :key="afval">
              <v-chip v-if="afval % 2 == 0">{{ item }}</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-expand-transition>
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";

defineProps({
  name: String,
  address: String,
  id: String,
  garbageinfo: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
td {
  border-right: solid 1px rgb(216, 216, 216);
  border-left: solid 1px rgb(216, 216, 216);
}
</style>
