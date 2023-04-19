<template>
  <div class="ma-4 flex gap-4">
    <v-btn @click="badIdea">Divide By Zero (Blocking)</v-btn>
    <v-btn @click="badIdeaAsync">Divide By Zero (Non Blocking)</v-btn>
  </div>
</template>

<script setup lang="ts">
import { tryOrAlert, tryOrAlertAsync } from "@/try";

/**
 * Dummy function which generates an exception.
 */
function badIdea() {
  const result = tryOrAlert<Number>(() => {
    const x = 1;
    const y = 0;

    if (y === 0) {
      throw new Error("Division By Zero");
    }

    return x / y;
  });

  return result ?? Number.POSITIVE_INFINITY;
}

/**
 * Dummy function which generates an exception, but does so asynchronously.
 */
async function badIdeaAsync() {
  const result = await tryOrAlertAsync<Number>(async () => {
    const x = 1;
    const y = 0;

    if (y === 0) {
      throw new Error("Division By Zero");
    }

    return x / y;
  });

  return result ?? Number.POSITIVE_INFINITY;
}
</script>

<style scoped></style>
