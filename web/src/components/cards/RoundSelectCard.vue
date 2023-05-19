<template>
  <BorderCard class="round-select-card">
    <div>
      <div v-if="alreadyPlanned">
        <h3>{{ date?.toLocaleDateString() }}</h3>
      </div>
      <div class="d-flex" v-else>
        <v-icon color="green" icon="mdi-new-box" class="mr-1"></v-icon>
        <h3>{{ date?.toLocaleDateString() }}</h3>
      </div>
      <p>{{ name }}</p>
    </div>

    <div class="flex-grow-1"></div>
    <RoundedButton
      icon="mdi-clock-time-two-outline"
      :value="time"
      class="bg-grey-lighten-2"
    ></RoundedButton>

    <v-icon
      id="remove"
      @click="$emit('remove')"
      color="error"
      icon="mdi-close"
    />
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
  alreadyPlanned: { type: Boolean, required: true },
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
