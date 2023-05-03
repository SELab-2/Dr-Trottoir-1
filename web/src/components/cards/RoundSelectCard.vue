<template>
  <BorderCard class="round-select-card">
    <div>
      <h3>{{ date?.toLocaleDateString() }}</h3>
      <p>{{ name }}</p>
    </div>

    <div class="flex-grow-1"></div>

    <RoundedButton
      icon="mdi-clock-time-two-outline"
      :value="time"
      class="bg-grey-lighten-2"
    ></RoundedButton>

    <v-icon id="remove" @click="$emit('remove')" color="error" icon="mdi-close" />
  </BorderCard>
</template>

<script setup lang="ts">
import BorderCard from "@/layouts/CardLayout.vue";
import RoundedButton from "@/components/buttons/RoundedButton.vue";

defineProps({
  name: String,
  date: Date,
  time: String,
  id: String,
});
</script>

<style lang="sass">
.round-select-card
  display: flex
  align-items: center
  gap: 12px
  padding: 24px 12px 24px 24px
  margin: 12px 0
</style>
