<template>
  <v-timeline side="end">
    <v-timeline-item
      v-for="(item, id) in ronde.buildings"
      :key="id"
      dot-color="blue"
      size="small"
    >
      <v-alert :value="true" color="blue" icon="blue">
        Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec
        ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril
        disputando voluptatibus, vix an salutandi sententiae.
      </v-alert>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts" setup>
import Round from "@/components/models/Round"

</script>
