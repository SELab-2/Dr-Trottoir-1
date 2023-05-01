<template>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel
      v-for="e of formattedErrors"
      :title="`Code: ${e.code} - ${e.title}`"
      :text="e.body"
    >
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { QueryError } from "@selab-2/groep-1-query";

const props = defineProps({
  errors: { type: Array<unknown>, required: true },
});

interface FormattedError {
  code: number;
  title: string;
  body: string;
}

const formattedErrors: FormattedError[] = getFormattedErrors();

function getFormattedErrors(): FormattedError[] {
  const formatted: FormattedError[] = [];

  for (const error of props.errors) {
    if (error instanceof QueryError) {
      formatted.push({
        code: error.code,
        title: error.name,
        body: error.message,
      });
    } else if (error instanceof TypeError) {
      formatted.push({
        code: 400,
        title: error.name,
        body: error.message,
      });
    } else if (error instanceof Error) {
      console.log(error)
      formatted.push({ code: 400, title: error.name, body: error.message });
    } else {
      formatted.push({
        code: 400,
        title: "Something went wrong",
        body: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      });
    }
  }

  return formatted;
}
</script>
