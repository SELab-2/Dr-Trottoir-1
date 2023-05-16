<template>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel
      v-for="(e, i) of formattedErrors"
      :key="i"
      :title="`Code: ${e.code} - ${e.title}`"
      :text="e.body"
    >
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
const props = defineProps({
  errors: { type: Array<unknown>, required: true },
});

interface FormattedError {
  code: number;
  title: string;
  body: string;
}

const formattedErrors: FormattedError[] = getFormattedErrors();

/**
 * Format the errors, so each error follows the same interface
 * If there is a new ErrorType introduced, this should be added to this to have it's own interface
 */
function getFormattedErrors(): FormattedError[] {
  const formatted: FormattedError[] = [];

  for (const error of props.errors) {
    formatted.push({
      code: error.code ?? 503,
      title: error.name ?? "Something went wrong",
      body: error.message ?? "Unknown error",
    });
  }

  return formatted;
}
</script>
